import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { logger } from "@/lib/logger";

const prisma = new PrismaClient();

interface ProfileData {
  type: "MAIN" | "BRANCH";
  companyName: string;
  companyRegNumber: string;
  address: string;
  country: string;
  postalCode: string;
  email: string;
  contact: string;
  isActive: boolean;
}

// GET - Load company profile data (staging first, then production)
export async function GET() {
  try {
    // First check if staging table has data
    const stagingProfiles = await prisma.companyProfileStaging.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    if (stagingProfiles.length > 0) {
      logger.info("Loading company profiles from staging table", {
        count: stagingProfiles.length,
      });
      return NextResponse.json({
        success: true,
        data: stagingProfiles,
        source: "staging",
      });
    }

    // If no staging data, load from production
    const productionProfiles = await prisma.companyProfile.findMany({
      where: { isActive: true },
      orderBy: { createdAt: "desc" },
    });

    logger.info("Loading company profiles from production table", {
      count: productionProfiles.length,
    });

    return NextResponse.json({
      success: true,
      data: productionProfiles,
      source: "production",
    });
  } catch (error) {
    logger.error("Error loading company profiles", { error });
    return NextResponse.json(
      { success: false, error: "Failed to load company profiles" },
      { status: 500 }
    );
  }
}

// POST - Save to staging table
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profiles } = body;

    if (!profiles || !Array.isArray(profiles)) {
      return NextResponse.json(
        { success: false, error: "Invalid profiles data" },
        { status: 400 }
      );
    }

    // Clear existing staging data
    await prisma.companyProfileStaging.deleteMany({});

    // Insert new staging data
    const stagingProfiles = await prisma.companyProfileStaging.createMany({
      data: profiles.map((profile: ProfileData) => ({
        type: profile.type,
        companyName: profile.companyName,
        companyRegNumber: profile.companyRegNumber,
        address: profile.address,
        country: profile.country,
        postalCode: profile.postalCode,
        email: profile.email,
        contact: profile.contact,
        isActive: profile.isActive,
      })),
    });

    logger.info("Company profiles saved to staging table", {
      count: stagingProfiles.count,
    });

    return NextResponse.json({
      success: true,
      message: "Profiles saved to staging",
      count: stagingProfiles.count,
    });
  } catch (error) {
    logger.error("Error saving company profiles to staging", { error });
    return NextResponse.json(
      { success: false, error: "Failed to save profiles to staging" },
      { status: 500 }
    );
  }
}

// PUT - Upload from staging to production
export async function PUT() {
  try {
    // Get staging data
    const stagingProfiles = await prisma.companyProfileStaging.findMany({
      where: { isActive: true },
    });

    if (stagingProfiles.length === 0) {
      return NextResponse.json(
        { success: false, error: "No staging data to upload" },
        { status: 400 }
      );
    }

    // Clear existing production data
    await prisma.companyProfile.deleteMany({});

    // Insert staging data to production
    const productionProfiles = await prisma.companyProfile.createMany({
      data: stagingProfiles.map((profile) => ({
        type: profile.type,
        companyName: profile.companyName,
        companyRegNumber: profile.companyRegNumber,
        address: profile.address,
        country: profile.country,
        postalCode: profile.postalCode,
        email: profile.email,
        contact: profile.contact,
        isActive: profile.isActive,
      })),
    });

    // Clear staging data
    await prisma.companyProfileStaging.deleteMany({});

    logger.info("Company profiles uploaded from staging to production", {
      count: productionProfiles.count,
    });

    return NextResponse.json({
      success: true,
      message: "Profiles uploaded to production",
      count: productionProfiles.count,
    });
  } catch (error) {
    logger.error("Error uploading company profiles to production", { error });
    return NextResponse.json(
      { success: false, error: "Failed to upload profiles to production" },
      { status: 500 }
    );
  }
}

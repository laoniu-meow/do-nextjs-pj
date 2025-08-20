import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const runtime = 'nodejs';

// GET - Load production data
export async function GET() {
  try {
    const productionData = await prisma.companyProfileProduction.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    return NextResponse.json({ success: true, data: productionData });
  } catch (error) {
    console.error("Error loading production data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load production data" },
      { status: 500 }
    );
  }
}

// POST - Move data from staging to production
export async function POST() {
  try {
    // Get staging data
    const stagingData = await prisma.companyProfileStaging.findMany({
      orderBy: { createdAt: "asc" },
    });

    if (stagingData.length === 0) {
      return NextResponse.json(
        { success: false, error: "No staging data to upload" },
        { status: 400 }
      );
    }

    // Clear existing production data
    await prisma.companyProfileProduction.deleteMany();

    // Insert staging data into production
    const productionData = await prisma.companyProfileProduction.createMany({
      data: stagingData,
    });

    // Clear staging data after successful upload
    await prisma.companyProfileStaging.deleteMany();

    return NextResponse.json({ 
      success: true, 
      message: "Data uploaded to production",
      count: productionData.count 
    });
  } catch (error) {
    console.error("Error uploading to production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to upload to production" },
      { status: 500 }
    );
  }
}

// DELETE - Remove specific company from production
export async function DELETE(request: NextRequest) {
  try {
    const body = await request.json();
    const { company } = body;

    if (!company) {
      return NextResponse.json(
        { success: false, error: "Company data is required" },
        { status: 400 }
      );
    }

    // Remove the specific company by matching its data
    const deletedCompany = await prisma.companyProfileProduction.deleteMany({
      where: {
        name: company.name,
        companyRegNumber: company.companyRegNumber || null,
        email: company.email || null,
        address: company.address || null,
        country: company.country || null,
        postalCode: company.postalCode || null,
        contact: company.contact || null,
        logo: company.logo || null,
      },
    });

    return NextResponse.json({ 
      success: true, 
      message: "Company removed from production",
      count: deletedCompany.count 
    });
  } catch (error) {
  console.error("Error removing company from production:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove company from production" },
      { status: 500 }
    );
  }
}

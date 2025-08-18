import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { CompanyFormData } from "@/types";

const prisma = new PrismaClient();

export const runtime = 'nodejs';

// GET - Load staging data
export async function GET() {
  try {
    const stagingData = await prisma.companyProfileStaging.findMany({
      orderBy: { createdAt: "asc" },
    });
    
    return NextResponse.json({ success: true, data: stagingData });
  } catch (error) {
    console.error("Error loading staging data:", error);
    return NextResponse.json(
      { success: false, error: "Failed to load staging data" },
      { status: 500 }
    );
  }
}

// POST - Save data to staging
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { companies } = body;

    // Clear existing staging data
    await prisma.companyProfileStaging.deleteMany();

    // Insert new staging data
    const stagingData = await prisma.companyProfileStaging.createMany({
      data: companies.map((company: CompanyFormData, index: number) => ({
        ...company,
        isMainCompany: index === 0, // First company is main
      })),
    });

    return NextResponse.json({ 
      success: true, 
      message: "Data saved to staging",
      count: stagingData.count 
    });
  } catch (error) {
    console.error("Error saving to staging:", error);
    return NextResponse.json(
      { success: false, error: "Failed to save to staging" },
      { status: 500 }
    );
  }
}

// DELETE - Remove specific company from staging
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
    const deletedCompany = await prisma.companyProfileStaging.deleteMany({
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
      message: "Company removed from staging",
      count: deletedCompany.count 
    });
  } catch (error) {
    console.error("Error removing company from staging:", error);
    return NextResponse.json(
      { success: false, error: "Failed to remove company from staging" },
      { status: 500 }
    );
  }
}

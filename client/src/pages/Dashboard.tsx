import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PageHeader } from "@/components/shared/PageHeader";
import { Link } from "react-router-dom";
import { ClipboardList, DoorOpen, Package, Hammer, Wrench, Building } from "lucide-react";

export default function Dashboard() {
  const managementAreas = [
    { title: "Leases", description: "Manage lease agreements and renewals.", icon: ClipboardList, link: "/leases" },
    { title: "Turnovers", description: "Oversee apartment transitions between tenants.", icon: DoorOpen, link: "/turnovers" },
    { title: "Inspections", description: "Schedule and record property inspections.", icon: Package, link: "/inspections" },
    { title: "Renovations", description: "Track and manage renovation projects.", icon: Hammer, link: "/renovations" },
    { title: "Work Orders", description: "Handle maintenance requests and repairs.", icon: Wrench, link: "/work-orders" },
    { title: "Properties", description: "View and manage your property portfolio.", icon: Building, link: "/properties" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Welcome to the Rental Management Service. Here's an overview of your operations."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {managementAreas.map((area, index) => (
          <Card key={index} className="hover:shadow-lg transition-shadow">
            <Link to={area.link} className="block p-6">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-medium">{area.title}</CardTitle>
                <area.icon className="h-6 w-6 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>{area.description}</CardDescription>
              </CardContent>
            </Link>
          </Card>
        ))}
      </div>

      {/* Potentially add some summary charts or urgent tasks here if API supported */}
    </div>
  );
}
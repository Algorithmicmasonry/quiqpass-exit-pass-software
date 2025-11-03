import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "~/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { Input } from "~/components/ui/input";
import {
  Clock,
  CheckCircle,
  XCircle,
  MapPin,
  Calendar,
  Search,
  Filter,
} from "lucide-react";
import { getStatusColor, getStatusIcon } from "~/services/getPassStatusService";
import { DashboardHeaders } from "~/components/dashboard";

// <CHANGE> Added comprehensive mock data for pass requests
const mockRequests = [
  {
    id: "REQ-001",
    type: "Short Pass",
    destination: "Medical Appointment",
    reason: "Dental checkup at University Hospital",
    departureDate: "2024-01-15",
    departureTime: "14:00",
    returnDate: "2024-01-15",
    returnTime: "17:00",
    status: "approved",
    submittedAt: "2024-01-10T10:30:00",
    approvedBy: "Dr. Johnson (CSO)",
    approvedAt: "2024-01-11T09:15:00",
  },
  {
    id: "REQ-002",
    type: "Long Pass",
    destination: "Home Visit",
    reason: "Family emergency - father's surgery",
    departureDate: "2024-01-20",
    departureTime: "08:00",
    returnDate: "2024-01-25",
    returnTime: "18:00",
    status: "pending",
    submittedAt: "2024-01-12T14:20:00",
    forwardedBy: "Porter Williams",
    forwardedAt: "2024-01-12T15:00:00",
  },
  {
    id: "REQ-003",
    type: "Short Pass",
    destination: "Shopping Mall",
    reason: "Purchase textbooks and supplies",
    departureDate: "2024-01-08",
    departureTime: "10:00",
    returnDate: "2024-01-08",
    returnTime: "15:00",
    status: "completed",
    submittedAt: "2024-01-05T11:00:00",
    approvedBy: "Dr. Johnson (CSO)",
    approvedAt: "2024-01-06T08:30:00",
    checkedOutAt: "2024-01-08T10:05:00",
    checkedInAt: "2024-01-08T14:45:00",
  },
  {
    id: "REQ-004",
    type: "Short Pass",
    destination: "City Library",
    reason: "Research for final year project",
    departureDate: "2024-01-03",
    departureTime: "09:00",
    returnDate: "2024-01-03",
    returnTime: "16:00",
    status: "denied",
    submittedAt: "2024-01-02T16:45:00",
    deniedBy: "Dr. Johnson (CSO)",
    deniedAt: "2024-01-03T07:20:00",
    denialReason: "Insufficient notice period",
  },
  {
    id: "REQ-005",
    type: "Long Pass",
    destination: "Accra",
    reason: "Attend cousin's wedding ceremony",
    departureDate: "2024-02-01",
    departureTime: "06:00",
    returnDate: "2024-02-03",
    returnTime: "20:00",
    status: "pending",
    submittedAt: "2024-01-14T09:00:00",
  },
];

export default function RequestsPage() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");

  // <CHANGE> Filter requests based on status and search query
  const filteredRequests = mockRequests.filter((request) => {
    const matchesStatus =
      statusFilter === "all" || request.status === statusFilter;
    const matchesSearch =
      searchQuery === "" ||
      request.destination.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      request.reason.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-6">
      <DashboardHeaders
        mainText="My Pass Requests"
        subText="View and manage your exit pass requests"
      />

      {/* <CHANGE> Added filters and search */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Requests</CardTitle>
          <CardDescription>
            Search and filter your pass requests
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by destination, ID, or reason..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="sm:w-48">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue placeholder="Filter by status"  />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="denied">Denied</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* <CHANGE> Added comprehensive requests table */}
      <Card>
        <CardHeader>
          <CardTitle>All Requests ({filteredRequests.length})</CardTitle>
          <CardDescription>
            Complete history of your exit pass applications
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Request ID</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Destination</TableHead>
                  <TableHead>Departure</TableHead>
                  <TableHead>Return</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredRequests.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-center py-8 text-gray-800"
                    >
                      No requests found matching your filters
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredRequests.map((request) => (
                    <TableRow key={request.id}>
                      <TableCell className="font-medium">
                        {request.id}
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className="bg-primary/10 text-primary border-primary/20"
                        >
                          {request.type}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <MapPin className="h-3 w-3 text-muted-foreground" />
                          <span className="max-w-[150px] truncate">
                            {request.destination}
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div>
                              {new Date(
                                request.departureDate
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {request.departureTime}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2 text-sm">
                          <Calendar className="h-3 w-3 text-muted-foreground" />
                          <div>
                            <div>
                              {new Date(
                                request.returnDate
                              ).toLocaleDateString()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {request.returnTime}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={getStatusColor(request.status)}
                        >
                          <span className="flex items-center gap-1">
                            {getStatusIcon(request.status)}
                            {request.status.charAt(0).toUpperCase() +
                              request.status.slice(1)}
                          </span>
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(request.submittedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="sm">
                          View Details
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

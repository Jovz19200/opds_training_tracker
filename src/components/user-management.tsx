"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { useDispatch, useSelector } from "react-redux"
import { AppDispatch, RootState } from "@/redux/store"
import {
  fetchUsers,
  createUser,
  updateUser,
  deleteUser,
  type User,
  enable2FAForUser,
  disable2FAForUser
} from "@/redux/api/userApiSlice"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { useToast } from "@/components/ui/use-toast"
import { 
  Pencil, 
  Trash2, 
  UserPlus, 
  ShieldCheck, 
  AlertCircle, 
  Edit, 
  Loader2,
  Search,
  Filter
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Toggle from "@/components/ui/toggle"
import React from "react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { OTMSLoader } from "@/components/ui/otms-loader"
import { Pagination } from "@/components/ui/pagination"

interface UserTableRowProps {
  user: User;
  handleEditClick: (user: User) => void;
  handleDeleteUser: (userId: string) => void;
  handle2FAToggleAttempt: (user: User, newStatus: boolean) => void;
}

const getInitials = (firstName: string, lastName: string) => {
  return `${firstName?.[0] || ''}${lastName?.[0] || ''}`.toUpperCase();
};

const UserTableRow: React.FC<UserTableRowProps> = React.memo(
  ({ user, handleEditClick, handleDeleteUser, handle2FAToggleAttempt }) => (
    <TableRow key={user._id}>
      <TableCell>
        <UserAvatar initials={getInitials(user.firstName, user.lastName)} />
      </TableCell>
      <TableCell>{`${user.firstName} ${user.lastName}`}</TableCell>
      <TableCell>{user.email}</TableCell>
      <TableCell>
        <Badge variant="outline">{user.role}</Badge>
      </TableCell>
      <TableCell>
        <Badge variant={user.status === "active" ? "default" : "secondary"}>
          {user.status}
        </Badge>
      </TableCell>
      <TableCell>
        <Toggle
          enabled={user.twoFAStatus}
          onChange={(newStatus) => handle2FAToggleAttempt(user, newStatus)}
          size="sm"
          label={user.twoFAStatus ? "Enabled" : "Disabled"}
        />
      </TableCell>
      <TableCell>
        <div className="flex space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleEditClick(user)}
            aria-label="Edit"
          >
            <Edit className="h-5 w-5 text-primary" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => handleDeleteUser(user._id)}
            aria-label="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-destructive"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </Button>
        </div>
      </TableCell>
    </TableRow>
  )
);
UserTableRow.displayName = 'UserTableRow';

export function UserManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading, pagination } = useSelector((state: RootState) => state.users)
  const { dashboardMetrics } = useSelector((state: RootState) => state.analytics)
  const { toast } = useToast()
  
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [usersPerPage, setUsersPerPage] = useState(10)
  const [searchTerm, setSearchTerm] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  
  // Dialog states
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [is2FAConfirmDialogOpen, setIs2FAConfirmDialogOpen] = useState(false)
  const [isDeleteConfirmDialogOpen, setIsDeleteConfirmDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [twoFAToggleUser, setTwoFAToggleUser] = useState<User | null>(null)
  const [twoFAToggleNewStatus, setTwoFAToggleNewStatus] = useState<boolean>(false)
  const [formData, setFormData] = useState<Partial<User>>({
    firstName: "",
    lastName: "",
    email: "",
    role: "",
    status: "active"
  })
  const [twoFALoading, setTwoFALoading] = useState(false);
  const [deleteUserId, setDeleteUserId] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);

  // Get total users count from analytics or pagination
  const totalUsers = dashboardMetrics?.overview?.totalUsers || pagination?.totalUsers || 0;

  // Client-side filtered and paginated users
  const filteredUsers = useMemo(() => {
    if (!users) return [];
    
    let filtered = [...users];
    
    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase().trim();
      filtered = filtered.filter(user => 
        user.firstName.toLowerCase().includes(searchLower) ||
        user.lastName.toLowerCase().includes(searchLower) ||
        user.email.toLowerCase().includes(searchLower) ||
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchLower)
      );
    }
    
    // Apply role filter
    if (roleFilter && roleFilter !== "all") {
      filtered = filtered.filter(user => user.role === roleFilter);
    }
    
    // Apply status filter
    if (statusFilter && statusFilter !== "all") {
      filtered = filtered.filter(user => user.status === statusFilter);
    }
    
    return filtered;
  }, [users, searchTerm, roleFilter, statusFilter]);

  // Paginated users for current page
  const paginatedUsers = useMemo(() => {
    const startIndex = (currentPage - 1) * usersPerPage;
    const endIndex = startIndex + usersPerPage;
    return filteredUsers.slice(startIndex, endIndex);
  }, [filteredUsers, currentPage, usersPerPage]);

  // Calculate pagination info
  const paginationInfo = useMemo(() => {
    const totalFilteredUsers = filteredUsers.length;
    const totalPages = Math.ceil(totalFilteredUsers / usersPerPage);
    const hasNextPage = currentPage < totalPages;
    const hasPrevPage = currentPage > 1;
    
    return {
      currentPage,
      totalPages,
      totalUsers: totalFilteredUsers,
      usersPerPage,
      hasNextPage,
      hasPrevPage
    };
  }, [filteredUsers.length, currentPage, usersPerPage]);

  // Fetch users (only pagination, no search/filter params)
  const fetchUsersWithPagination = useCallback(() => {
    const params = {
      page: 1, // Always fetch all users for client-side filtering
      limit: 1000, // Large limit to get all users
    };
    
    dispatch(fetchUsers(params));
  }, [dispatch]);

  useEffect(() => {
    fetchUsersWithPagination();
  }, [fetchUsersWithPagination]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, roleFilter, statusFilter]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1); // Reset to first page when filtering
  };

  const clearFilters = () => {
    setSearchTerm("");
    setRoleFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const handleCreateUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await dispatch(createUser(formData)).unwrap()
      setIsCreateDialogOpen(false)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        status: "active"
      })
      fetchUsersWithPagination()
      toast({
        title: "Success",
        description: "User created successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to create user",
        variant: "destructive",
      })
    }
  }, [dispatch, formData, toast, fetchUsersWithPagination]);

  const handleUpdateUser = useCallback(async (e: React.FormEvent) => {
    e.preventDefault()
    if (!selectedUser) return

    try {
      await dispatch(updateUser({ id: selectedUser._id, userData: formData })).unwrap()
      setIsEditDialogOpen(false)
      setSelectedUser(null)
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        role: "",
        status: "active"
      })
      fetchUsersWithPagination()
      toast({
        title: "Success",
        description: "User updated successfully",
      })
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update user",
        variant: "destructive",
      })
    }
  }, [dispatch, selectedUser, formData, toast, fetchUsersWithPagination]);

  const handleDeleteUser = useCallback((userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteConfirmDialogOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteUser(deleteUserId)).unwrap();
      
      // Smart page navigation after deletion
      if (pagination) {
        const totalUsersAfterDelete = pagination.totalUsers - 1;
        const totalPagesAfterDelete = Math.ceil(totalUsersAfterDelete / pagination.usersPerPage);
        
        // If current page becomes empty and it's not the first page, go to previous page
        if (currentPage > totalPagesAfterDelete && currentPage > 1) {
          setCurrentPage(currentPage - 1);
        } else {
          // Refresh current page
          fetchUsersWithPagination();
        }
      } else {
        // Fallback: just refresh
        fetchUsersWithPagination();
      }
      
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to delete user",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(false);
      setIsDeleteConfirmDialogOpen(false);
      setDeleteUserId(null);
    }
  }, [dispatch, deleteUserId, toast, pagination, currentPage, fetchUsersWithPagination]);

  const handleEditClick = useCallback((user: User) => {
    setSelectedUser(user)
    setFormData({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      status: user.status
    })
    setIsEditDialogOpen(true)
  }, []);

  const handle2FAToggleAttempt = useCallback((user: User, newStatus: boolean) => {
    setTwoFAToggleUser(user)
    setTwoFAToggleNewStatus(newStatus)
    setIs2FAConfirmDialogOpen(true)
  }, []);

  const confirm2FAAction = useCallback(async () => {
    const user = twoFAToggleUser;
    if (!user) return;
    setTwoFALoading(true);
    try {
      if (twoFAToggleNewStatus) {
        await dispatch(enable2FAForUser(user._id)).unwrap();
      } else {
        await dispatch(disable2FAForUser(user._id)).unwrap();
      }
      fetchUsersWithPagination();
      toast({
        title: "Success",
        description: `2FA status updated to ${twoFAToggleNewStatus ? 'enabled' : 'disabled'} for ${user.firstName} ${user.lastName}.`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Failed to update 2FA status",
        variant: "destructive",
      });
    } finally {
      setTwoFALoading(false);
      setIs2FAConfirmDialogOpen(false);
      setTwoFAToggleUser(null);
    }
  }, [dispatch, twoFAToggleUser, twoFAToggleNewStatus, toast, fetchUsersWithPagination]);

  if (loading && !users) {
    return <OTMSLoader />;
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">User Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <UserPlus className="mr-2 h-4 w-4" /> Add User
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New User</DialogTitle>
              <DialogDescription>
                Fill in the details to create a new user.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateUser} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="firstName">First Name</label>
                  <Input
                    id="firstName"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="lastName">Last Name</label>
                  <Input
                    id="lastName"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="email">Email</label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role">Role</label>
                <Select
                  value={formData.role}
                  onValueChange={(value) => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="trainer">Trainer</SelectItem>
                    <SelectItem value="trainee">Trainee</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <DialogFooter>
                <Button type="submit">Create User</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>

          {/* Role Filter */}
          <Select value={roleFilter} onValueChange={handleRoleFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="admin">Admin</SelectItem>
              <SelectItem value="trainer">Trainer</SelectItem>
              <SelectItem value="trainee">Trainee</SelectItem>
            </SelectContent>
          </Select>

          {/* Status Filter */}
          <Select value={statusFilter} onValueChange={handleStatusFilter}>
            <SelectTrigger className="w-full sm:w-32">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>

          {/* Clear Filters */}
          {(searchTerm || roleFilter !== "all" || statusFilter !== "all") && (
            <Button variant="outline" onClick={clearFilters} size="sm">
              Clear Filters
            </Button>
          )}
        </div>

        {/* Users per page */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-600">Show:</span>
          <Select value={usersPerPage.toString()} onValueChange={(value) => setUsersPerPage(Number(value))}>
            <SelectTrigger className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Results Summary */}
      <div className="text-sm text-gray-600">
        Showing {((paginationInfo.currentPage - 1) * paginationInfo.usersPerPage) + 1} to{" "}
        {Math.min(paginationInfo.currentPage * paginationInfo.usersPerPage, paginationInfo.totalUsers)} of{" "}
        {paginationInfo.totalUsers} users
        {searchTerm || roleFilter !== "all" || statusFilter !== "all" ? " (filtered)" : ""}
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Avatar</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>2FA Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="flex items-center justify-center">
                  <Loader2 className="h-6 w-6 animate-spin mr-2" />
                  Loading users...
                </div>
              </TableCell>
            </TableRow>
          ) : paginatedUsers.length > 0 ? (
            paginatedUsers.map((user) => (
              <UserTableRow
                key={user._id}
                user={user}
          handleEditClick={handleEditClick}
          handleDeleteUser={handleDeleteUser}
          handle2FAToggleAttempt={handle2FAToggleAttempt}
        />
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={7} className="text-center py-8">
                <div className="text-muted-foreground">
                  {filteredUsers.length === 0 && (searchTerm || roleFilter !== "all" || statusFilter !== "all") 
                    ? "No users match your filters" 
                    : "No users found"}
                </div>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>

      {/* Pagination Controls */}
      {paginationInfo.totalPages > 1 && (
        <Pagination
          currentPage={paginationInfo.currentPage}
          totalPages={paginationInfo.totalPages}
          onPageChange={handlePageChange}
          hasNextPage={paginationInfo.hasNextPage}
          hasPrevPage={paginationInfo.hasPrevPage}
        />
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
            <DialogDescription>
              Update the user's information.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateUser} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="edit-firstName">First Name</label>
                <Input
                  id="edit-firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="edit-lastName">Last Name</label>
                <Input
                  id="edit-lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-email">Email</label>
              <Input
                id="edit-email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-role">Role</label>
              <Select
                value={formData.role}
                onValueChange={(value) => setFormData({ ...formData, role: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="trainer">Trainer</SelectItem>
                  <SelectItem value="trainee">Trainee</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-status">Status</label>
              <Select
                value={formData.status}
                onValueChange={(value) => setFormData({ ...formData, status: value as 'active' | 'inactive' })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <DialogFooter>
              <Button type="submit">Update User</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 2FA Confirmation Dialog */}
      <Dialog open={is2FAConfirmDialogOpen} onOpenChange={setIs2FAConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-yellow-500" />
                Confirm 2FA Action
              </div>
            </DialogTitle>
            <DialogDescription>
              {twoFAToggleUser
                ? `Are you sure you want to ${twoFAToggleNewStatus ? "enable" : "disable"} Two-Factor Authentication for ${twoFAToggleUser.firstName} ${twoFAToggleUser.lastName}?`
                : "No user selected."}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIs2FAConfirmDialogOpen(false)} disabled={twoFALoading}>Cancel</Button>
            <Button onClick={confirm2FAAction} disabled={twoFALoading}>
              {twoFALoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={isDeleteConfirmDialogOpen} onOpenChange={setIsDeleteConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirm Delete
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this user? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteConfirmDialogOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button onClick={confirmDeleteUser} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
} 
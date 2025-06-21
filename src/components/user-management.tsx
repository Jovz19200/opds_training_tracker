"use client"

import { useEffect, useState, useCallback } from "react"
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
import { Pencil, Trash2, UserPlus, ShieldCheck, AlertCircle, Edit, Loader2 } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Toggle from "@/components/ui/toggle"
import React from "react"
import { UserAvatar } from "@/components/ui/user-avatar"
import { OTMSLoader } from "@/components/ui/otms-loader"

interface UserTableRowProps {
  user: User;
  handleEditClick: (user: User) => void;
  handleDeleteUser: (userId: string) => Promise<void>;
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

interface UsersTableBodyProps {
  users: User[];
  handleEditClick: (user: User) => void;
  handleDeleteUser: (userId: string) => Promise<void>;
  handle2FAToggleAttempt: (user: User, newStatus: boolean) => void;
}

const UsersTableBody: React.FC<UsersTableBodyProps> = React.memo(
  ({ users, handleEditClick, handleDeleteUser, handle2FAToggleAttempt }) => (
    <TableBody>
      {users.map((user) => (
        <UserTableRow
          key={user._id}
          user={user}
          handleEditClick={handleEditClick}
          handleDeleteUser={handleDeleteUser}
          handle2FAToggleAttempt={handle2FAToggleAttempt}
        />
      ))}
    </TableBody>
  )
);
UsersTableBody.displayName = 'UsersTableBody';

export function UserManagement() {
  const dispatch = useDispatch<AppDispatch>()
  const { users, loading } = useSelector((state: RootState) => state.users)
  const { toast } = useToast()
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

  useEffect(() => {
    dispatch(fetchUsers())
  }, [dispatch])

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
  }, [dispatch, formData, toast]);

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
  }, [dispatch, selectedUser, formData, toast]);

  const handleDeleteUser = useCallback(async (userId: string) => {
    setDeleteUserId(userId);
    setIsDeleteConfirmDialogOpen(true);
  }, []);

  const confirmDeleteUser = useCallback(async () => {
    if (!deleteUserId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteUser(deleteUserId)).unwrap();
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
  }, [dispatch, deleteUserId, toast]);

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
  }, [dispatch, twoFAToggleUser, twoFAToggleNewStatus, toast]);

  if (loading) {
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
        <UsersTableBody
          users={users}
          handleEditClick={handleEditClick}
          handleDeleteUser={handleDeleteUser}
          handle2FAToggleAttempt={handle2FAToggleAttempt}
        />
      </Table>

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
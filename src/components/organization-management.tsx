import React, { useEffect, useState, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/redux/store";
import {
  fetchOrganizations,
  fetchOrganizationById,
  createOrganization,
  updateOrganization,
  deleteOrganization,
  type Organization,
} from "@/redux/api/organizationApiSlice";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { Edit, Loader2, AlertCircle } from "lucide-react";
import { OTMSLoader } from "@/components/ui/otms-loader";

export function OrganizationManagement() {
  const dispatch = useDispatch<AppDispatch>();
  const { organizations, loading } = useSelector((state: RootState) => state.organizations);
  const { toast } = useToast();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedOrg, setSelectedOrg] = useState<Organization | null>(null);
  const [formData, setFormData] = useState<Partial<Organization>>({ name: "", description: "", address: "", contactEmail: "", contactPhone: "" });
  const [formError, setFormError] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);
  const [createLoading, setCreateLoading] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteOrgId, setDeleteOrgId] = useState<string | null>(null);

  const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

  useEffect(() => {
    dispatch(fetchOrganizations());
  }, [dispatch]);

  const validateForm = () => {
    if (!formData.name || !formData.description || !formData.address || !formData.contactEmail || !formData.contactPhone) {
      setFormError("All fields are required.");
      return false;
    }
    if (!emailRegex.test(formData.contactEmail)) {
      setFormError("Please enter a valid email address.");
      return false;
    }
    setFormError(null);
    return true;
  };

  const handleCreateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;
    setCreateLoading(true);
    try {
      await dispatch(createOrganization(formData)).unwrap();
      setIsCreateDialogOpen(false);
      setFormData({ name: "", description: "", address: "", contactEmail: "", contactPhone: "" });
      toast({ title: "Success", description: "Organization created." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to create organization", variant: "destructive" });
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditClick = (org: Organization) => {
    setSelectedOrg(org);
    setFormData({
      name: org.name,
      description: org.description,
      address: org.address,
      contactEmail: org.contactEmail,
      contactPhone: org.contactPhone,
    });
    setIsEditDialogOpen(true);
  };

  const handleUpdateOrg = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOrg) return;
    if (!validateForm()) return;
    setEditLoading(true);
    try {
      await dispatch(updateOrganization({ id: selectedOrg._id, orgData: formData })).unwrap();
      setIsEditDialogOpen(false);
      setSelectedOrg(null);
      setFormData({ name: "", description: "", address: "", contactEmail: "", contactPhone: "" });
      toast({ title: "Success", description: "Organization updated." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to update organization", variant: "destructive" });
    } finally {
      setEditLoading(false);
    }
  };

  const handleDeleteClick = (orgId: string) => {
    setDeleteOrgId(orgId);
    setIsDeleteDialogOpen(true);
  };

  const confirmDeleteOrg = async () => {
    if (!deleteOrgId) return;
    setDeleteLoading(true);
    try {
      await dispatch(deleteOrganization(deleteOrgId)).unwrap();
      toast({ title: "Success", description: "Organization deleted." });
    } catch (error: any) {
      toast({ title: "Error", description: error.message || "Failed to delete organization", variant: "destructive" });
    } finally {
      setDeleteLoading(false);
      setIsDeleteDialogOpen(false);
      setDeleteOrgId(null);
    }
  };

  if (loading) return <OTMSLoader />;

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Organization Management</h2>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add Organization</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create Organization</DialogTitle>
              <DialogDescription>Fill in the details to create a new organization.</DialogDescription>
            </DialogHeader>
            <form onSubmit={handleCreateOrg} className="space-y-4">
              {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
              <div className="space-y-2">
                <label htmlFor="org-name">Name</label>
                <Input id="org-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="org-desc">Description</label>
                <Input id="org-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="org-address">Address</label>
                <Input id="org-address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="org-email">Contact Email</label>
                <Input id="org-email" type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} required />
              </div>
              <div className="space-y-2">
                <label htmlFor="org-phone">Contact Phone</label>
                <Input id="org-phone" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} required />
              </div>
              <DialogFooter>
                <Button type="submit" disabled={createLoading}>
                  {createLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                  Create
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {organizations.map(org => (
            <TableRow key={org._id}>
              <TableCell>{org.name}</TableCell>
              <TableCell>{org.description}</TableCell>
              <TableCell>{new Date(org.createdAt).toLocaleDateString()}</TableCell>
              <TableCell>
                <div className="flex space-x-2">
                  <Button variant="ghost" size="icon" onClick={() => handleEditClick(org)} aria-label="Edit">
                    <Edit className="h-5 w-5 text-primary" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(org._id)} aria-label="Delete">
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
          ))}
        </TableBody>
      </Table>
      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Organization</DialogTitle>
            <DialogDescription>Update the organization's details.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateOrg} className="space-y-4">
            {formError && <div className="text-red-600 text-sm mb-2">{formError}</div>}
            <div className="space-y-2">
              <label htmlFor="edit-org-name">Name</label>
              <Input id="edit-org-name" value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-org-desc">Description</label>
              <Input id="edit-org-desc" value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-org-address">Address</label>
              <Input id="edit-org-address" value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-org-email">Contact Email</label>
              <Input id="edit-org-email" type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })} required />
            </div>
            <div className="space-y-2">
              <label htmlFor="edit-org-phone">Contact Phone</label>
              <Input id="edit-org-phone" value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })} required />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={editLoading}>
                {editLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
                Update
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-destructive" />
                Confirm Delete
              </div>
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this organization? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={deleteLoading}>Cancel</Button>
            <Button onClick={confirmDeleteOrg} disabled={deleteLoading} variant="destructive">
              {deleteLoading ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : null}
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
} 
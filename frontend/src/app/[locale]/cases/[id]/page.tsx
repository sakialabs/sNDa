"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { authFetch, authUpload } from "@/lib/api/client";
import type { Case, VolunteerProfile, ReferralMediaItem } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { useAuth } from "@/contexts/auth-context";

export default function CaseDetailsPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isAuthenticated, user } = useAuth();
  const [item, setItem] = useState<Case | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [volunteers, setVolunteers] = useState<VolunteerProfile[]>([]);
  const [loadingVolunteers, setLoadingVolunteers] = useState(true);
  const STATUS_OPTIONS = useMemo(
    () =>
      [
        { value: "NEW", label: "New" },
        { value: "TRIAGED", label: "Triaged" },
        { value: "ASSIGNED", label: "Assigned" },
        { value: "IN_PROGRESS", label: "In Progress" },
        { value: "ON_HOLD", label: "On Hold" },
        { value: "RESOLVED", label: "Resolved" },
      ] as const,
    []
  );
  const [status, setStatus] = useState<string>("NEW");
  const [assignedVolunteerId, setAssignedVolunteerId] = useState<string>("");
  const [media, setMedia] = useState<ReferralMediaItem[]>([]);
  const [uploading, setUploading] = useState(false);
  const [supportOpen, setSupportOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [activeMediaIdx, setActiveMediaIdx] = useState(0);

  const displayVolunteers = useMemo(() => {
    if (
      !assignedVolunteerId ||
      volunteers.some((v) => String(v.user.id) === String(assignedVolunteerId))
    ) {
      return volunteers;
    }
    if (item?.assigned_volunteer) {
      const injected: VolunteerProfile = {
        user: {
          id: String(item.assigned_volunteer.id),
          username: item.assigned_volunteer.username,
          email: item.assigned_volunteer.email,
          first_name: item.assigned_volunteer.first_name,
          last_name: item.assigned_volunteer.last_name,
        },
        is_onboarded: false,
      };
      return [injected, ...volunteers];
    }
    return volunteers;
  }, [assignedVolunteerId, volunteers, item]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        setLoadingVolunteers(isAuthenticated);
        const [caseRes, mediaRes] = await Promise.all([
          authFetch(`/api/cases/${params.id}/`),
          authFetch(`/api/media/?case=${params.id}`),
        ]);
        const [caseData, mediaData] = await Promise.all([
          caseRes.json(),
          mediaRes.json(),
        ]);
        setItem(caseData);
        if (isAuthenticated) {
          try {
            const volsRes = await authFetch(`/api/volunteers/`);
            const volsData = await volsRes.json();
            const vols: VolunteerProfile[] = Array.isArray(volsData)
              ? volsData
              : volsData?.results ?? [];
            const normalized = vols.map((v) => ({
              ...v,
              user: { ...v.user, id: String(v.user.id) },
            }));
            setVolunteers(normalized);
          } catch (_e) {
            setVolunteers([]);
          }
        } else {
          setVolunteers([]);
        }
        setStatus(caseData?.status ?? "NEW");
        setAssignedVolunteerId(
          caseData?.assigned_volunteer?.id
            ? String(caseData.assigned_volunteer.id)
            : ""
        );
        setMedia(
          Array.isArray(mediaData) ? mediaData : mediaData?.results ?? []
        );
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load case");
      } finally {
        setLoading(false);
        setLoadingVolunteers(false);
      }
    };
    load();
  }, [params.id, isAuthenticated]);

  useEffect(() => {
    if (searchParams.get("support") === "1") {
      setSupportOpen(true);
    }
  }, [searchParams]);

  async function handleSave(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    try {
      setSaving(true);
      const res = await authFetch(`/api/cases/${item.id}/`, {
        method: "PUT",
        body: JSON.stringify({
          title: item.title,
          description: item.description,
          status,
          urgency_score: item.urgency_score,
          primary_subject_id: item.primary_subject?.id,
          assigned_volunteer_id: assignedVolunteerId || null,
        }),
      });
      const updated = await res.json();
      setItem(updated);
      setStatus(updated?.status ?? status);
      setAssignedVolunteerId(
        updated?.assigned_volunteer?.id ?? assignedVolunteerId
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save case");
    } finally {
      setSaving(false);
    }
  }

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!item) return;
    const form = e.currentTarget as HTMLFormElement;
    const fileInput = form.elements.namedItem(
      "file"
    ) as HTMLInputElement | null;
    const descInput = form.elements.namedItem(
      "media_desc"
    ) as HTMLInputElement | null;
    const consentInput = form.elements.namedItem(
      "media_consent"
    ) as HTMLInputElement | null;
    if (!fileInput || !fileInput.files || fileInput.files.length === 0) return;
    const fd = new FormData();
    fd.append("case", String(item.id));
    fd.append("file", fileInput.files[0]);
    if (descInput?.value) fd.append("description", descInput.value);
    fd.append("consent_given", consentInput?.checked ? "true" : "false");
    try {
      setUploading(true);
      const res = await authUpload(`/api/media/`, fd);
      const created = (await res.json()) as ReferralMediaItem;
      setMedia((m) => [created, ...m]);
      form.reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to upload media");
    } finally {
      setUploading(false);
    }
  }

  if (loading)
    return <div className="text-sm text-muted-foreground">Loading…</div>;
  if (error) return <div className="text-sm text-red-600">{error}</div>;
  if (!item) return null;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Case Details</h1>
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground">
            {isAuthenticated ? "Review and manage" : "Learn about this referral"}
          </p>
          {isAuthenticated ? (
            editMode ? (
              <Button variant="secondary" onClick={() => setEditMode(false)}>
                Done
              </Button>
            ) : (
              <Button onClick={() => setEditMode(true)}>Edit case</Button>
            )
          ) : (
            <Button variant="secondary" onClick={() => setSupportOpen(true)}>
              Offer support
            </Button>
          )}
        </div>
      </div>

      {/* Media Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Referral Media</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {media.length > 0 ? (
            <div>
              <div className="aspect-[16/9] overflow-hidden rounded bg-muted flex items-center justify-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={media[activeMediaIdx].file}
                  alt={media[activeMediaIdx].description || "Referral media"}
                  className="h-full w-full object-contain"
                />
              </div>
              <div className="mt-2 flex gap-2 overflow-x-auto">
                {media.map((m, i) => (
                  <button
                    key={m.id}
                    onClick={() => setActiveMediaIdx(i)}
                    className={`h-14 w-20 rounded border overflow-hidden ${
                      i === activeMediaIdx ? "ring-2 ring-ring" : ""
                    }`}
                    aria-label={`Preview ${i + 1}`}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={m.file}
                      alt={m.description || `Media ${i + 1}`}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="aspect-[16/9] rounded bg-muted flex items-center justify-center text-5xl">
              🥪
            </div>
          )}

          {isAuthenticated && (
            <form
              className="grid gap-3 sm:grid-cols-2 items-end"
              onSubmit={handleUpload}
            >
              <div className="space-y-2">
                <Label htmlFor="file">File</Label>
                <Input id="file" name="file" type="file" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="media_desc">Description (optional)</Label>
                <Input
                  id="media_desc"
                  name="media_desc"
                  placeholder="Short description"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  id="media_consent"
                  name="media_consent"
                  type="checkbox"
                  className="h-4 w-4"
                />
                <Label htmlFor="media_consent">Consent obtained</Label>
              </div>
              <div>
                <Button type="submit" disabled={uploading}>
                  {uploading ? "Uploading…" : "Upload"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>

      {/* Details and Edit Form */}
      <Card>
        <CardHeader>
          <CardTitle>{item.title}</CardTitle>
        </CardHeader>
        <CardContent>
          {editMode ? (
            <form className="space-y-4" onSubmit={handleSave}>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={item.title}
                    onChange={(e) =>
                      setItem({ ...item, title: e.target.value })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <select
                    id="status"
                    className="border rounded h-9 px-3 bg-background"
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                  >
                    {STATUS_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgency score</Label>
                  <Input
                    id="urgency"
                    type="number"
                    value={item.urgency_score ?? ""}
                    onChange={(e) =>
                      setItem({
                        ...item,
                        urgency_score: Number(e.target.value),
                      })
                    }
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="volunteer">Assigned volunteer</Label>
                  <select
                    id="volunteer"
                    className="border rounded h-9 px-3 bg-background"
                    value={assignedVolunteerId}
                    onChange={(e) => setAssignedVolunteerId(e.target.value)}
                    aria-busy={loadingVolunteers}
                  >
                    <option value="">Unassigned</option>
                    {displayVolunteers.map((v) => {
                      const name =
                        v.user.first_name && v.user.last_name
                          ? `${v.user.first_name} ${v.user.last_name}`
                          : v.user.username;
                      return (
                        <option
                          key={String(v.user.id)}
                          value={String(v.user.id)}
                        >
                          {name}
                        </option>
                      );
                    })}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  rows={5}
                  value={item.description}
                  onChange={(e) =>
                    setItem({ ...item, description: e.target.value })
                  }
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={saving}>
                  {saving ? "Saving…" : "Save changes"}
                </Button>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setEditMode(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          ) : (
            <div className="space-y-3">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <p className="font-medium">
                    {STATUS_OPTIONS.find((s) => s.value === item.status)
                      ?.label || item.status}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Urgency score</p>
                  <p className="font-medium">{item.urgency_score ?? "—"}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">
                    Assigned volunteer
                  </p>
                  <p className="font-medium">
                    {item.assigned_volunteer
                      ? item.assigned_volunteer.first_name &&
                        item.assigned_volunteer.last_name
                        ? `${item.assigned_volunteer.first_name} ${item.assigned_volunteer.last_name}`
                        : item.assigned_volunteer.username
                      : "Unassigned"}
                  </p>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="whitespace-pre-wrap leading-relaxed">
                  {item.description}
                </p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Dialog open={supportOpen} onOpenChange={setSupportOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Offer support</DialogTitle>
            <DialogDescription>
              You can reach out to the assigned volunteer or contact our
              coordinator for assistance.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            {item.assigned_volunteer?.email ? (
              <Button asChild className="w-full">
                <a
                  href={`mailto:${
                    item.assigned_volunteer.email
                  }?subject=${encodeURIComponent(
                    `Support for case: ${item.title}`
                  )}`}
                >
                  Email assigned volunteer
                </a>
              </Button>
            ) : (
              <Button asChild className="w-full">
                <a
                  href={`mailto:snda@hey.me?subject=${encodeURIComponent(
                    `Support needed for case: ${item.title}`
                  )}&body=${encodeURIComponent(
                    `Hello,\n\nI would like to offer support for case: ${item.title}\n\nCase details: ${item.description}\n\nPlease let me know how I can help.\n\nBest regards`
                  )}`}
                >
                  Contact coordinator
                </a>
              </Button>
            )}
            <Button
              variant="secondary"
              className="w-full"
              onClick={() => navigator.clipboard.writeText(window.location.href)}
            >
              Copy case link
            </Button>
            <Button
              variant="outline"
              className="w-full"
              onClick={() => {
                navigator.clipboard.writeText(
                  `Case: ${item.title}\nDescription: ${
                    item.description
                  }\nStatus: ${item.status}\nUrgency: ${
                    item.urgency_score || "Not set"
                  }`
                );
              }}
            >
              Copy case details
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

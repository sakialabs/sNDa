"use client";

import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ProfileClient() {
  const { user } = useAuth();

  if (!user) return null;

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name;

  const initials = `${user.first_name?.[0] ?? user.username?.[0] ?? ""}${
    user.last_name?.[0] ?? ""
  }`;

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Profile</h1>
        <p className="text-muted-foreground">Your account details</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src="https://github.com/shadcn.png"
              alt={fullName || user.username}
            />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl">
              {fullName || user.username}
            </CardTitle>
            {fullName && (
              <p className="text-sm text-muted-foreground">@{user.username}</p>
            )}
          </div>
        </CardHeader>
        <CardContent className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-sm text-muted-foreground">Username</p>
            <p className="font-medium">{user.username}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{user.email}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">First name</p>
            <p className="font-medium">{user.first_name || "—"}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Last name</p>
            <p className="font-medium">{user.last_name || "—"}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

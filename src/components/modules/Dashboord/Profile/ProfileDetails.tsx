import { UserProfile } from "@/types/user.types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ProfileDetailsProps {
  profile?: UserProfile;
}

const formatKey = (key: string) => {
  const result = key.replace(/([A-Z])/g, " $1");
  return result.charAt(0).toUpperCase() + result.slice(1);
};

const formatDate = (dateString: string) => {
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch (e) {
    return dateString;
  }
};

export default function ProfileDetails({ profile }: ProfileDetailsProps) {
  if (!profile) return null;

  // Filter out system fields or null values
  const displayFields = Object.entries(profile).filter(
    ([key, value]) =>
      !["id", "userId", "image", "createdAt", "updatedAt", "deletedAt", "isDeleted"].includes(key) &&
      value !== null &&
      value !== ""
  );

  if (displayFields.length === 0) {
    return (
      <Card className="shadow-xs">
        <CardHeader>
          <CardTitle className="text-xl">Additional Details</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground text-sm">No additional profile details available.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xs">
      <CardHeader>
        <CardTitle className="text-xl">Additional Details</CardTitle>
      </CardHeader>
      <CardContent>
        <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-6">
          {displayFields.map(([key, value]) => {
            const isDate = key.toLowerCase().includes("date") && typeof value === "string";
            
            return (
              <div key={key} className="space-y-1 border-b border-border/50 pb-4 sm:border-0 sm:pb-0">
                <dt className="text-sm font-medium text-muted-foreground">{formatKey(key)}</dt>
                <dd className="text-base font-medium">
                  {isDate ? formatDate(value as string) : String(value)}
                </dd>
              </div>
            );
          })}
        </dl>
      </CardContent>
    </Card>
  );
}

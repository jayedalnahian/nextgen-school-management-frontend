import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user.types";

const QualificationCell = ({ qualification }: { qualification: string }) => {
  if (!qualification) {
    return (
      <Badge>
        <span className="text-sm capitalize">Not Available</span>
      </Badge>
    );
  }

  if (qualification.length > 20) {
    return (
      <Badge>
        <span className="text-sm capitalize">
          {qualification.slice(0, 20)}...
        </span>
      </Badge>
    );
  }
  return (
    <Badge>
      <span className="text-sm capitalize">{qualification}</span>
    </Badge>
  );
};

export default QualificationCell;

import { Badge } from "@/components/ui/badge";
import { UserStatus } from "@/types/user.types";




interface IVerifiedBadgeCellProps {
    isVerified : boolean;
}

const VerifiedBadgeCell = ({ isVerified }: IVerifiedBadgeCellProps) => {
  return (
    <Badge
    
        variant={isVerified ? "default" : "destructive"}
        // className="px-2 py-1"
    >
        <span className="text-sm capitalize">{isVerified ? "Verified" : "Not Verified"}</span>
    </Badge>
  )
}

export default VerifiedBadgeCell
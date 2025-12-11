import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Shield, Mail, Pencil, User, Trash2 } from 'lucide-react';
import type { Member } from '@/types';
import { getRoleColor } from '@/utils/getRoleColor';
import { getSectionColor } from '@/utils/getSectionColor';

interface MembersListProps {
  members: Member[];
  onEdit: (member: Member) => void;
  onDelete: (member: Member) => void;
}

const MembersList = ({ members, onEdit, onDelete }: MembersListProps) => {
  return (
    <div className="space-y-3 pt-4">
      {members.map((member) => (
        <Card key={member.id} className="border-border bg-card">
          <CardContent className="p-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-card-foreground">
                    {member.name}
                  </h3>
                  <div className="flex flex-wrap gap-2 mt-1">
                    <Badge
                      variant="outline"
                      className={`text-xs ${getRoleColor(member.role)}`}
                    >
                      <Shield className="mr-1 h-3 w-3" />
                      {member.role}
                    </Badge>
                    <Badge
                      variant="outline"
                      className={`text-xs ${getSectionColor(member.section)}`}
                    >
                      {member.section}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-1 mt-2 text-xs text-muted-foreground">
                    <Mail className="h-3 w-3" />
                    {member.email}
                  </div>
                </div>
              </div>

              <div className="flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(member)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive hover:text-destructive hover:bg-destructive/10"
                  onClick={() => onDelete(member)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default MembersList;

import { useState } from 'react';
import AppLayout from '@/components/layout/AppLayout';
import { useToast } from '@/hooks/useToast';
import CreateMemberDialog from './components/CreateMemberDialog';
import EditMemberDialog from './components/EditMemberDialog';
import MembersList from './components/MembersList';
import type { CreateMemberFormData, EditMemberFormData } from './types';
import { initialMembers } from '@/mock-list';
import type { Member, Role, Section } from '@/types';
import MemberDeleteConfirmationDialog from './components/MemberDeleteConfirmationDialog';

const MembersPage = () => {
  const [members, setMembers] = useState<Member[]>(initialMembers);
  const [editingMember, setEditingMember] = useState<Member | null>(null);
  const [memberToDelete, setMemberToDelete] = useState<Member | null>(null);
  const { toast } = useToast();

  const handleCreateMember = (data: CreateMemberFormData) => {
    const newMember: Member = {
      id: data.id,
      name: data.name,
      role: data.role as Role,
      section: data.section as Section,
      email: data.email,
      password: data.password,
    };

    setMembers((prev) => [...prev, newMember]);
    toast({
      title: 'Membro adicionado',
      description: `${data.name} foi cadastrado com sucesso.`,
    });
  };

  const handleConfirmDelete = () => {
    if (memberToDelete) {
      setMembers((prev) => prev.filter((m) => m.id !== memberToDelete.id));
      toast({
        title: 'Membro removido',
        description: `${memberToDelete.name} foi excluído com sucesso.`,
        variant: 'destructive',
      });
      setMemberToDelete(null);
    }
  };

  const handleSaveEdit = (data: EditMemberFormData) => {
    setMembers((prev) =>
      prev.map((member) =>
        member.id === data.id
          ? {
              ...member,
              ...data,
              role: data.role as Role,
              section: data.section as Section,
            }
          : member
      )
    );
    toast({
      title: 'Dados atualizados',
      description: 'As alterações foram salvas com sucesso.',
    });
    setEditingMember(null);
  };

  return (
    <AppLayout title="Membros">
      <div className="space-y-4 p-4">
        <CreateMemberDialog onCreate={handleCreateMember} />

        <MembersList
          members={members}
          onEdit={setEditingMember}
          onDelete={setMemberToDelete}
        />

        <EditMemberDialog
          isOpen={!!editingMember}
          member={editingMember}
          onClose={() => setEditingMember(null)}
          onSave={handleSaveEdit}
        />

        <MemberDeleteConfirmationDialog
          isOpen={!!memberToDelete}
          memberName={memberToDelete?.name || ''}
          onClose={() => setMemberToDelete(null)}
          onConfirm={handleConfirmDelete}
        />
      </div>
    </AppLayout>
  );
};

export default MembersPage;

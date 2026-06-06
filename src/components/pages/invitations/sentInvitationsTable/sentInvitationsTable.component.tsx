import {
  UserRoleMeta,
  type UserRoleType,
} from "../../../../constants/general.constant";
import { Badge, Table, type Column } from "../../../../common";
import { InvitationRequestStatusMeta } from "../../../../constants";

interface ISentInvitation {
  id: string;
  name: string;
  email: string;
  role: UserRoleType;
  status: string;
  invitedBy: string;
  expiresAt: string;
}

interface ISentInvitationsTableProps {
  data: ISentInvitation[];
  isLoading?: boolean;
  pagination?: Common.IPagination;
  onPageChange?: (page: number) => void;
}

export function SentInvitationsTable({
  data,
  isLoading,
  pagination,
  onPageChange,
}: ISentInvitationsTableProps) {
  const columns: Column<ISentInvitation>[] = [
    {
      header: "Name",
      key: "name",
      render: (item) => <span>{item.name}</span>,
    },
    {
      header: "Email",
      key: "email",
      render: (item) => <span>{item.email}</span>,
    },
    {
      header: "Role",
      key: "role",
      render: (item) => {
        return (
          <Badge
            variant={UserRoleMeta[item.role].badgeVariant}
            label={UserRoleMeta[item.role].label}
          />
        );
      },
    },
    {
      header: "Status",
      key: "status",
      render: (item) => {
        return (
          <Badge
            variant={
              InvitationRequestStatusMeta[
                item.status as keyof typeof InvitationRequestStatusMeta
              ].badgeVariant
            }
            label={
              InvitationRequestStatusMeta[
                item.status as keyof typeof InvitationRequestStatusMeta
              ].label
            }
          />
        );
      },
    },
    {
      header: "Invited By",
      key: "invitedBy",
      render: (item) => <span>{item.invitedBy}</span>,
    },
    {
      header: "Expires At",
      key: "expiresAt",
      render: (item) => <span>{item.expiresAt}</span>,
    },
  ];

  return (
    <Table<ISentInvitation>
      data={data}
      columns={columns}
      loading={isLoading}
      pagination={pagination}
      onPageChange={onPageChange}
    />
  );
}

export const InvitationRequestStatus = {
  PENDING: "pending",
  REJECTED: "rejected",
  INVITED: "invited",
} as const;

export type InvitationRequestStatusType =
  (typeof InvitationRequestStatus)[keyof typeof InvitationRequestStatus];

export const InvitationStatusMeta: Record<
  InvitationRequestStatusType,
  {
    label: string;
    badgeVariant: InvitationRequestStatusType;
  }
> = {
  [InvitationRequestStatus.PENDING]: {
    label: "Pending",
    badgeVariant: InvitationRequestStatus.PENDING,
  },
  [InvitationRequestStatus.REJECTED]: {
    label: "Rejected",
    badgeVariant: InvitationRequestStatus.REJECTED,
  },
  [InvitationRequestStatus.INVITED]: {
    label: "Invited",
    badgeVariant: InvitationRequestStatus.INVITED,
  },
};

export const USER_INVITATION_STATUS_ARR = [
  {
    value: InvitationRequestStatus.PENDING,
    label: InvitationStatusMeta[InvitationRequestStatus.PENDING].label,
  },
  {
    value: InvitationRequestStatus.REJECTED,
    label: InvitationStatusMeta[InvitationRequestStatus.REJECTED].label,
  },
  {
    value: InvitationRequestStatus.INVITED,
    label: InvitationStatusMeta[InvitationRequestStatus.INVITED].label,
  },
];

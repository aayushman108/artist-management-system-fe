export const InvitationRequestStatus = {
  PENDING: "pending",
  REJECTED: "rejected",
  INVITED: "invited",
} as const;

export type InvitationRequestStatusType =
  (typeof InvitationRequestStatus)[keyof typeof InvitationRequestStatus];

export const InvitationRequestStatusMeta: Record<
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

export const INVITATION_REQUEST_STATUS_ARR = [
  {
    value: InvitationRequestStatus.PENDING,
    label: InvitationRequestStatusMeta[InvitationRequestStatus.PENDING].label,
  },
  {
    value: InvitationRequestStatus.REJECTED,
    label: InvitationRequestStatusMeta[InvitationRequestStatus.REJECTED].label,
  },
  {
    value: InvitationRequestStatus.INVITED,
    label: InvitationRequestStatusMeta[InvitationRequestStatus.INVITED].label,
  },
];

export const InvitationStatus = {
  PENDING: "pending",
  ACCEPTED: "accepted",
  EXPIRED: "expired",
} as const;

export type InvitationStatusType =
  (typeof InvitationStatus)[keyof typeof InvitationStatus];

export const InvitationStatusMeta: Record<
  InvitationStatusType,
  {
    label: string;
    badgeVariant: InvitationStatusType;
  }
> = {
  [InvitationStatus.PENDING]: {
    label: "Pending",
    badgeVariant: InvitationStatus.PENDING,
  },
  [InvitationStatus.ACCEPTED]: {
    label: "Accepted",
    badgeVariant: InvitationStatus.ACCEPTED,
  },
  [InvitationStatus.EXPIRED]: {
    label: "Expired",
    badgeVariant: InvitationStatus.EXPIRED,
  },
};

export const INVITATION_STATUS_ARR = [
  {
    value: InvitationStatus.PENDING,
    label: InvitationStatusMeta[InvitationStatus.PENDING].label,
  },
  {
    value: InvitationStatus.ACCEPTED,
    label: InvitationStatusMeta[InvitationStatus.ACCEPTED].label,
  },
  {
    value: InvitationStatus.EXPIRED,
    label: InvitationStatusMeta[InvitationStatus.EXPIRED].label,
  },
];

import { ConnectorConfig, DataConnect, QueryRef, QueryPromise, ExecuteQueryOptions, MutationRef, MutationPromise } from 'firebase/data-connect';

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;




export interface AddCategoryData {
  category_insert: Category_Key;
}

export interface AddCategoryVariables {
  name: string;
  kind: string;
  icon?: string | null;
  sortOrder?: number | null;
}

export interface AddEntryData {
  entry_insert: Entry_Key;
}

export interface AddEntryVariables {
  kind: string;
  amount: number;
  date: DateString;
  note?: string | null;
  categoryId?: UUIDString | null;
  paymentMethodId?: UUIDString | null;
  paidCardId?: UUIDString | null;
}

export interface AddPaymentMethodData {
  paymentMethod_insert: PaymentMethod_Key;
}

export interface AddPaymentMethodVariables {
  name: string;
  type: string;
  creditLimit?: number | null;
  lastStatementBalance?: number | null;
  lastStatementDate?: DateString | null;
  paymentDueDate?: DateString | null;
  sortOrder?: number | null;
}

export interface ArchiveCategoryData {
  category_updateMany: number;
}

export interface ArchiveCategoryVariables {
  id: UUIDString;
}

export interface ArchivePaymentMethodData {
  paymentMethod_updateMany: number;
}

export interface ArchivePaymentMethodVariables {
  id: UUIDString;
}

export interface CardActivityData {
  member?: {
    household: {
      cards: ({
        id: UUIDString;
        charges: ({
          amount: number;
          date: DateString;
        })[];
        refunds: ({
          amount: number;
          date: DateString;
        })[];
        payments: ({
          amount: number;
          date: DateString;
        })[];
      } & PaymentMethod_Key)[];
    };
  };
}

export interface CardActivityVariables {
  since: DateString;
}

export interface Category_Key {
  id: UUIDString;
  __typename?: 'Category_Key';
}

export interface CreateHouseholdData {
  household_insert: Household_Key;
  member_upsert: Member_Key;
  paymentMethod_insert: PaymentMethod_Key;
  category_insertMany: Category_Key[];
  category_insert: Category_Key;
}

export interface CreateHouseholdVariables {
  name: string;
  inviteCode: string;
  currency: string;
}

export interface DeleteEntryData {
  entry_deleteMany: number;
}

export interface DeleteEntryVariables {
  id: UUIDString;
}

export interface Entry_Key {
  id: UUIDString;
  __typename?: 'Entry_Key';
}

export interface GetMyHomeData {
  user?: {
    id: string;
    displayName: string;
    email?: string | null;
  } & User_Key;
  member?: {
    role: string;
    household: {
      id: UUIDString;
      name: string;
      inviteCode: string;
      currency: string;
      members: ({
        role: string;
        user: {
          id: string;
          displayName: string;
          email?: string | null;
        } & User_Key;
      })[];
      paymentMethods: ({
        id: UUIDString;
        name: string;
        type: string;
        creditLimit?: number | null;
        lastStatementBalance?: number | null;
        lastStatementDate?: DateString | null;
        paymentDueDate?: DateString | null;
      } & PaymentMethod_Key)[];
      categories: ({
        id: UUIDString;
        name: string;
        kind: string;
        icon?: string | null;
        systemKey?: string | null;
      } & Category_Key)[];
    } & Household_Key;
  };
}

export interface Household_Key {
  id: UUIDString;
  __typename?: 'Household_Key';
}

export interface JoinHouseholdData {
  member_upsert: Member_Key;
}

export interface JoinHouseholdVariables {
  inviteCode: string;
}

export interface LeaveHouseholdData {
  member_delete?: Member_Key | null;
}

export interface ListEntriesData {
  member?: {
    household: {
      entries: ({
        id: UUIDString;
        kind: string;
        amount: number;
        date: DateString;
        note?: string | null;
        createdAt: TimestampString;
        category?: {
          id: UUIDString;
          name: string;
          icon?: string | null;
          systemKey?: string | null;
        } & Category_Key;
        paymentMethod?: {
          id: UUIDString;
          name: string;
          type: string;
        } & PaymentMethod_Key;
        paidCard?: {
          id: UUIDString;
          name: string;
        } & PaymentMethod_Key;
        createdBy: {
          id: string;
          displayName: string;
        } & User_Key;
      } & Entry_Key)[];
    };
  };
}

export interface ListEntriesVariables {
  from: DateString;
  to: DateString;
  limit?: number | null;
}

export interface Member_Key {
  userId: string;
  __typename?: 'Member_Key';
}

export interface PaymentMethod_Key {
  id: UUIDString;
  __typename?: 'PaymentMethod_Key';
}

export interface RemoveMemberData {
  member_deleteMany: number;
}

export interface RemoveMemberVariables {
  userId: string;
}

export interface UpdateCategoryData {
  category_updateMany: number;
}

export interface UpdateCategoryVariables {
  id: UUIDString;
  name: string;
  icon?: string | null;
}

export interface UpdateEntryData {
  entry_updateMany: number;
}

export interface UpdateEntryVariables {
  id: UUIDString;
  kind: string;
  amount: number;
  date: DateString;
  note?: string | null;
  categoryId?: UUIDString | null;
  paymentMethodId?: UUIDString | null;
  paidCardId?: UUIDString | null;
}

export interface UpdateHouseholdData {
  household_updateMany: number;
}

export interface UpdateHouseholdVariables {
  name: string;
  currency: string;
}

export interface UpdatePaymentMethodData {
  paymentMethod_updateMany: number;
}

export interface UpdatePaymentMethodVariables {
  id: UUIDString;
  name: string;
  type: string;
  creditLimit?: number | null;
  lastStatementBalance?: number | null;
  lastStatementDate?: DateString | null;
  paymentDueDate?: DateString | null;
}

export interface UpsertMeData {
  user_upsert: User_Key;
}

export interface UpsertMeVariables {
  displayName: string;
  email?: string | null;
}

export interface User_Key {
  id: string;
  __typename?: 'User_Key';
}

interface UpsertMeRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMeVariables): MutationRef<UpsertMeData, UpsertMeVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpsertMeVariables): MutationRef<UpsertMeData, UpsertMeVariables>;
  operationName: string;
}
export const upsertMeRef: UpsertMeRef;

export function upsertMe(vars: UpsertMeVariables): MutationPromise<UpsertMeData, UpsertMeVariables>;
export function upsertMe(dc: DataConnect, vars: UpsertMeVariables): MutationPromise<UpsertMeData, UpsertMeVariables>;

interface CreateHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
  operationName: string;
}
export const createHouseholdRef: CreateHouseholdRef;

export function createHousehold(vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;
export function createHousehold(dc: DataConnect, vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface JoinHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinHouseholdVariables): MutationRef<JoinHouseholdData, JoinHouseholdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: JoinHouseholdVariables): MutationRef<JoinHouseholdData, JoinHouseholdVariables>;
  operationName: string;
}
export const joinHouseholdRef: JoinHouseholdRef;

export function joinHousehold(vars: JoinHouseholdVariables): MutationPromise<JoinHouseholdData, JoinHouseholdVariables>;
export function joinHousehold(dc: DataConnect, vars: JoinHouseholdVariables): MutationPromise<JoinHouseholdData, JoinHouseholdVariables>;

interface LeaveHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<LeaveHouseholdData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): MutationRef<LeaveHouseholdData, undefined>;
  operationName: string;
}
export const leaveHouseholdRef: LeaveHouseholdRef;

export function leaveHousehold(): MutationPromise<LeaveHouseholdData, undefined>;
export function leaveHousehold(dc: DataConnect): MutationPromise<LeaveHouseholdData, undefined>;

interface UpdateHouseholdRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHouseholdVariables): MutationRef<UpdateHouseholdData, UpdateHouseholdVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateHouseholdVariables): MutationRef<UpdateHouseholdData, UpdateHouseholdVariables>;
  operationName: string;
}
export const updateHouseholdRef: UpdateHouseholdRef;

export function updateHousehold(vars: UpdateHouseholdVariables): MutationPromise<UpdateHouseholdData, UpdateHouseholdVariables>;
export function updateHousehold(dc: DataConnect, vars: UpdateHouseholdVariables): MutationPromise<UpdateHouseholdData, UpdateHouseholdVariables>;

interface RemoveMemberRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveMemberVariables): MutationRef<RemoveMemberData, RemoveMemberVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: RemoveMemberVariables): MutationRef<RemoveMemberData, RemoveMemberVariables>;
  operationName: string;
}
export const removeMemberRef: RemoveMemberRef;

export function removeMember(vars: RemoveMemberVariables): MutationPromise<RemoveMemberData, RemoveMemberVariables>;
export function removeMember(dc: DataConnect, vars: RemoveMemberVariables): MutationPromise<RemoveMemberData, RemoveMemberVariables>;

interface AddPaymentMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPaymentMethodVariables): MutationRef<AddPaymentMethodData, AddPaymentMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddPaymentMethodVariables): MutationRef<AddPaymentMethodData, AddPaymentMethodVariables>;
  operationName: string;
}
export const addPaymentMethodRef: AddPaymentMethodRef;

export function addPaymentMethod(vars: AddPaymentMethodVariables): MutationPromise<AddPaymentMethodData, AddPaymentMethodVariables>;
export function addPaymentMethod(dc: DataConnect, vars: AddPaymentMethodVariables): MutationPromise<AddPaymentMethodData, AddPaymentMethodVariables>;

interface UpdatePaymentMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentMethodVariables): MutationRef<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdatePaymentMethodVariables): MutationRef<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;
  operationName: string;
}
export const updatePaymentMethodRef: UpdatePaymentMethodRef;

export function updatePaymentMethod(vars: UpdatePaymentMethodVariables): MutationPromise<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;
export function updatePaymentMethod(dc: DataConnect, vars: UpdatePaymentMethodVariables): MutationPromise<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;

interface ArchivePaymentMethodRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchivePaymentMethodVariables): MutationRef<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ArchivePaymentMethodVariables): MutationRef<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;
  operationName: string;
}
export const archivePaymentMethodRef: ArchivePaymentMethodRef;

export function archivePaymentMethod(vars: ArchivePaymentMethodVariables): MutationPromise<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;
export function archivePaymentMethod(dc: DataConnect, vars: ArchivePaymentMethodVariables): MutationPromise<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;

interface AddCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCategoryVariables): MutationRef<AddCategoryData, AddCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddCategoryVariables): MutationRef<AddCategoryData, AddCategoryVariables>;
  operationName: string;
}
export const addCategoryRef: AddCategoryRef;

export function addCategory(vars: AddCategoryVariables): MutationPromise<AddCategoryData, AddCategoryVariables>;
export function addCategory(dc: DataConnect, vars: AddCategoryVariables): MutationPromise<AddCategoryData, AddCategoryVariables>;

interface UpdateCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
  operationName: string;
}
export const updateCategoryRef: UpdateCategoryRef;

export function updateCategory(vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;
export function updateCategory(dc: DataConnect, vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface ArchiveCategoryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveCategoryVariables): MutationRef<ArchiveCategoryData, ArchiveCategoryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ArchiveCategoryVariables): MutationRef<ArchiveCategoryData, ArchiveCategoryVariables>;
  operationName: string;
}
export const archiveCategoryRef: ArchiveCategoryRef;

export function archiveCategory(vars: ArchiveCategoryVariables): MutationPromise<ArchiveCategoryData, ArchiveCategoryVariables>;
export function archiveCategory(dc: DataConnect, vars: ArchiveCategoryVariables): MutationPromise<ArchiveCategoryData, ArchiveCategoryVariables>;

interface AddEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEntryVariables): MutationRef<AddEntryData, AddEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: AddEntryVariables): MutationRef<AddEntryData, AddEntryVariables>;
  operationName: string;
}
export const addEntryRef: AddEntryRef;

export function addEntry(vars: AddEntryVariables): MutationPromise<AddEntryData, AddEntryVariables>;
export function addEntry(dc: DataConnect, vars: AddEntryVariables): MutationPromise<AddEntryData, AddEntryVariables>;

interface UpdateEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEntryVariables): MutationRef<UpdateEntryData, UpdateEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: UpdateEntryVariables): MutationRef<UpdateEntryData, UpdateEntryVariables>;
  operationName: string;
}
export const updateEntryRef: UpdateEntryRef;

export function updateEntry(vars: UpdateEntryVariables): MutationPromise<UpdateEntryData, UpdateEntryVariables>;
export function updateEntry(dc: DataConnect, vars: UpdateEntryVariables): MutationPromise<UpdateEntryData, UpdateEntryVariables>;

interface DeleteEntryRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEntryVariables): MutationRef<DeleteEntryData, DeleteEntryVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: DeleteEntryVariables): MutationRef<DeleteEntryData, DeleteEntryVariables>;
  operationName: string;
}
export const deleteEntryRef: DeleteEntryRef;

export function deleteEntry(vars: DeleteEntryVariables): MutationPromise<DeleteEntryData, DeleteEntryVariables>;
export function deleteEntry(dc: DataConnect, vars: DeleteEntryVariables): MutationPromise<DeleteEntryData, DeleteEntryVariables>;

interface GetMyHomeRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyHomeData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyHomeData, undefined>;
  operationName: string;
}
export const getMyHomeRef: GetMyHomeRef;

export function getMyHome(options?: ExecuteQueryOptions): QueryPromise<GetMyHomeData, undefined>;
export function getMyHome(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyHomeData, undefined>;

interface ListEntriesRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEntriesVariables): QueryRef<ListEntriesData, ListEntriesVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: ListEntriesVariables): QueryRef<ListEntriesData, ListEntriesVariables>;
  operationName: string;
}
export const listEntriesRef: ListEntriesRef;

export function listEntries(vars: ListEntriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListEntriesData, ListEntriesVariables>;
export function listEntries(dc: DataConnect, vars: ListEntriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListEntriesData, ListEntriesVariables>;

interface CardActivityRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CardActivityVariables): QueryRef<CardActivityData, CardActivityVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect, vars: CardActivityVariables): QueryRef<CardActivityData, CardActivityVariables>;
  operationName: string;
}
export const cardActivityRef: CardActivityRef;

export function cardActivity(vars: CardActivityVariables, options?: ExecuteQueryOptions): QueryPromise<CardActivityData, CardActivityVariables>;
export function cardActivity(dc: DataConnect, vars: CardActivityVariables, options?: ExecuteQueryOptions): QueryPromise<CardActivityData, CardActivityVariables>;


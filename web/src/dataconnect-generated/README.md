# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `pocketbook`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*GetMyHome*](#getmyhome)
  - [*ListEntries*](#listentries)
  - [*CardActivity*](#cardactivity)
- [**Mutations**](#mutations)
  - [*UpsertMe*](#upsertme)
  - [*CreateHousehold*](#createhousehold)
  - [*JoinHousehold*](#joinhousehold)
  - [*LeaveHousehold*](#leavehousehold)
  - [*UpdateHousehold*](#updatehousehold)
  - [*RemoveMember*](#removemember)
  - [*AddPaymentMethod*](#addpaymentmethod)
  - [*UpdatePaymentMethod*](#updatepaymentmethod)
  - [*ArchivePaymentMethod*](#archivepaymentmethod)
  - [*AddCategory*](#addcategory)
  - [*UpdateCategory*](#updatecategory)
  - [*ArchiveCategory*](#archivecategory)
  - [*AddEntry*](#addentry)
  - [*UpdateEntry*](#updateentry)
  - [*DeleteEntry*](#deleteentry)
  - [*AddInstallmentPlan*](#addinstallmentplan)
  - [*UpdateInstallmentPlan*](#updateinstallmentplan)
  - [*DeleteInstallmentPlan*](#deleteinstallmentplan)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `pocketbook`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@pocketbook/dataconnect` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@pocketbook/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@pocketbook/dataconnect';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `pocketbook` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## GetMyHome
You can execute the `GetMyHome` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyHome(options?: ExecuteQueryOptions): QueryPromise<GetMyHomeData, undefined>;

interface GetMyHomeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyHomeData, undefined>;
}
export const getMyHomeRef: GetMyHomeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyHome(dc: DataConnect, options?: ExecuteQueryOptions): QueryPromise<GetMyHomeData, undefined>;

interface GetMyHomeRef {
  ...
  (dc: DataConnect): QueryRef<GetMyHomeData, undefined>;
}
export const getMyHomeRef: GetMyHomeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyHomeRef:
```typescript
const name = getMyHomeRef.operationName;
console.log(name);
```

### Variables
The `GetMyHome` query has no variables.
### Return Type
Recall that executing the `GetMyHome` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyHomeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
        installmentPlans: ({
          id: UUIDString;
          description: string;
          totalAmount: number;
          months: number;
          startDate: DateString;
        } & InstallmentPlan_Key)[];
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
```
### Using `GetMyHome`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyHome } from '@pocketbook/dataconnect';


// Call the `getMyHome()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyHome();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyHome(dataConnect);

console.log(data.user);
console.log(data.member);

// Or, you can use the `Promise` API.
getMyHome().then((response) => {
  const data = response.data;
  console.log(data.user);
  console.log(data.member);
});
```

### Using `GetMyHome`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyHomeRef } from '@pocketbook/dataconnect';


// Call the `getMyHomeRef()` function to get a reference to the query.
const ref = getMyHomeRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyHomeRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.user);
console.log(data.member);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.user);
  console.log(data.member);
});
```

## ListEntries
You can execute the `ListEntries` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listEntries(vars: ListEntriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListEntriesData, ListEntriesVariables>;

interface ListEntriesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ListEntriesVariables): QueryRef<ListEntriesData, ListEntriesVariables>;
}
export const listEntriesRef: ListEntriesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listEntries(dc: DataConnect, vars: ListEntriesVariables, options?: ExecuteQueryOptions): QueryPromise<ListEntriesData, ListEntriesVariables>;

interface ListEntriesRef {
  ...
  (dc: DataConnect, vars: ListEntriesVariables): QueryRef<ListEntriesData, ListEntriesVariables>;
}
export const listEntriesRef: ListEntriesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listEntriesRef:
```typescript
const name = listEntriesRef.operationName;
console.log(name);
```

### Variables
The `ListEntries` query requires an argument of type `ListEntriesVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ListEntriesVariables {
  from: DateString;
  to: DateString;
  limit?: number | null;
}
```
### Return Type
Recall that executing the `ListEntries` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListEntriesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListEntries`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listEntries, ListEntriesVariables } from '@pocketbook/dataconnect';

// The `ListEntries` query requires an argument of type `ListEntriesVariables`:
const listEntriesVars: ListEntriesVariables = {
  from: ..., 
  to: ..., 
  limit: ..., // optional
};

// Call the `listEntries()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listEntries(listEntriesVars);
// Variables can be defined inline as well.
const { data } = await listEntries({ from: ..., to: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listEntries(dataConnect, listEntriesVars);

console.log(data.member);

// Or, you can use the `Promise` API.
listEntries(listEntriesVars).then((response) => {
  const data = response.data;
  console.log(data.member);
});
```

### Using `ListEntries`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listEntriesRef, ListEntriesVariables } from '@pocketbook/dataconnect';

// The `ListEntries` query requires an argument of type `ListEntriesVariables`:
const listEntriesVars: ListEntriesVariables = {
  from: ..., 
  to: ..., 
  limit: ..., // optional
};

// Call the `listEntriesRef()` function to get a reference to the query.
const ref = listEntriesRef(listEntriesVars);
// Variables can be defined inline as well.
const ref = listEntriesRef({ from: ..., to: ..., limit: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listEntriesRef(dataConnect, listEntriesVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.member);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.member);
});
```

## CardActivity
You can execute the `CardActivity` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
cardActivity(vars: CardActivityVariables, options?: ExecuteQueryOptions): QueryPromise<CardActivityData, CardActivityVariables>;

interface CardActivityRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CardActivityVariables): QueryRef<CardActivityData, CardActivityVariables>;
}
export const cardActivityRef: CardActivityRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
cardActivity(dc: DataConnect, vars: CardActivityVariables, options?: ExecuteQueryOptions): QueryPromise<CardActivityData, CardActivityVariables>;

interface CardActivityRef {
  ...
  (dc: DataConnect, vars: CardActivityVariables): QueryRef<CardActivityData, CardActivityVariables>;
}
export const cardActivityRef: CardActivityRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the cardActivityRef:
```typescript
const name = cardActivityRef.operationName;
console.log(name);
```

### Variables
The `CardActivity` query requires an argument of type `CardActivityVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CardActivityVariables {
  since: DateString;
}
```
### Return Type
Recall that executing the `CardActivity` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CardActivityData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `CardActivity`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, cardActivity, CardActivityVariables } from '@pocketbook/dataconnect';

// The `CardActivity` query requires an argument of type `CardActivityVariables`:
const cardActivityVars: CardActivityVariables = {
  since: ..., 
};

// Call the `cardActivity()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await cardActivity(cardActivityVars);
// Variables can be defined inline as well.
const { data } = await cardActivity({ since: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await cardActivity(dataConnect, cardActivityVars);

console.log(data.member);

// Or, you can use the `Promise` API.
cardActivity(cardActivityVars).then((response) => {
  const data = response.data;
  console.log(data.member);
});
```

### Using `CardActivity`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, cardActivityRef, CardActivityVariables } from '@pocketbook/dataconnect';

// The `CardActivity` query requires an argument of type `CardActivityVariables`:
const cardActivityVars: CardActivityVariables = {
  since: ..., 
};

// Call the `cardActivityRef()` function to get a reference to the query.
const ref = cardActivityRef(cardActivityVars);
// Variables can be defined inline as well.
const ref = cardActivityRef({ since: ..., });

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = cardActivityRef(dataConnect, cardActivityVars);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.member);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.member);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `pocketbook` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## UpsertMe
You can execute the `UpsertMe` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
upsertMe(vars: UpsertMeVariables): MutationPromise<UpsertMeData, UpsertMeVariables>;

interface UpsertMeRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpsertMeVariables): MutationRef<UpsertMeData, UpsertMeVariables>;
}
export const upsertMeRef: UpsertMeRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
upsertMe(dc: DataConnect, vars: UpsertMeVariables): MutationPromise<UpsertMeData, UpsertMeVariables>;

interface UpsertMeRef {
  ...
  (dc: DataConnect, vars: UpsertMeVariables): MutationRef<UpsertMeData, UpsertMeVariables>;
}
export const upsertMeRef: UpsertMeRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the upsertMeRef:
```typescript
const name = upsertMeRef.operationName;
console.log(name);
```

### Variables
The `UpsertMe` mutation requires an argument of type `UpsertMeVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpsertMeVariables {
  displayName: string;
  email?: string | null;
}
```
### Return Type
Recall that executing the `UpsertMe` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpsertMeData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpsertMeData {
  user_upsert: User_Key;
}
```
### Using `UpsertMe`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, upsertMe, UpsertMeVariables } from '@pocketbook/dataconnect';

// The `UpsertMe` mutation requires an argument of type `UpsertMeVariables`:
const upsertMeVars: UpsertMeVariables = {
  displayName: ..., 
  email: ..., // optional
};

// Call the `upsertMe()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await upsertMe(upsertMeVars);
// Variables can be defined inline as well.
const { data } = await upsertMe({ displayName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await upsertMe(dataConnect, upsertMeVars);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
upsertMe(upsertMeVars).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

### Using `UpsertMe`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, upsertMeRef, UpsertMeVariables } from '@pocketbook/dataconnect';

// The `UpsertMe` mutation requires an argument of type `UpsertMeVariables`:
const upsertMeVars: UpsertMeVariables = {
  displayName: ..., 
  email: ..., // optional
};

// Call the `upsertMeRef()` function to get a reference to the mutation.
const ref = upsertMeRef(upsertMeVars);
// Variables can be defined inline as well.
const ref = upsertMeRef({ displayName: ..., email: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = upsertMeRef(dataConnect, upsertMeVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_upsert);
});
```

## CreateHousehold
You can execute the `CreateHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createHousehold(vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface CreateHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
}
export const createHouseholdRef: CreateHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createHousehold(dc: DataConnect, vars: CreateHouseholdVariables): MutationPromise<CreateHouseholdData, CreateHouseholdVariables>;

interface CreateHouseholdRef {
  ...
  (dc: DataConnect, vars: CreateHouseholdVariables): MutationRef<CreateHouseholdData, CreateHouseholdVariables>;
}
export const createHouseholdRef: CreateHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createHouseholdRef:
```typescript
const name = createHouseholdRef.operationName;
console.log(name);
```

### Variables
The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateHouseholdVariables {
  name: string;
  inviteCode: string;
  currency: string;
}
```
### Return Type
Recall that executing the `CreateHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateHouseholdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateHouseholdData {
  household_insert: Household_Key;
  member_upsert: Member_Key;
  paymentMethod_insert: PaymentMethod_Key;
  category_insertMany: Category_Key[];
  category_insert: Category_Key;
}
```
### Using `CreateHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createHousehold, CreateHouseholdVariables } from '@pocketbook/dataconnect';

// The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`:
const createHouseholdVars: CreateHouseholdVariables = {
  name: ..., 
  inviteCode: ..., 
  currency: ..., 
};

// Call the `createHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createHousehold(createHouseholdVars);
// Variables can be defined inline as well.
const { data } = await createHousehold({ name: ..., inviteCode: ..., currency: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createHousehold(dataConnect, createHouseholdVars);

console.log(data.household_insert);
console.log(data.member_upsert);
console.log(data.paymentMethod_insert);
console.log(data.category_insertMany);
console.log(data.category_insert);

// Or, you can use the `Promise` API.
createHousehold(createHouseholdVars).then((response) => {
  const data = response.data;
  console.log(data.household_insert);
  console.log(data.member_upsert);
  console.log(data.paymentMethod_insert);
  console.log(data.category_insertMany);
  console.log(data.category_insert);
});
```

### Using `CreateHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createHouseholdRef, CreateHouseholdVariables } from '@pocketbook/dataconnect';

// The `CreateHousehold` mutation requires an argument of type `CreateHouseholdVariables`:
const createHouseholdVars: CreateHouseholdVariables = {
  name: ..., 
  inviteCode: ..., 
  currency: ..., 
};

// Call the `createHouseholdRef()` function to get a reference to the mutation.
const ref = createHouseholdRef(createHouseholdVars);
// Variables can be defined inline as well.
const ref = createHouseholdRef({ name: ..., inviteCode: ..., currency: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createHouseholdRef(dataConnect, createHouseholdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.household_insert);
console.log(data.member_upsert);
console.log(data.paymentMethod_insert);
console.log(data.category_insertMany);
console.log(data.category_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.household_insert);
  console.log(data.member_upsert);
  console.log(data.paymentMethod_insert);
  console.log(data.category_insertMany);
  console.log(data.category_insert);
});
```

## JoinHousehold
You can execute the `JoinHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
joinHousehold(vars: JoinHouseholdVariables): MutationPromise<JoinHouseholdData, JoinHouseholdVariables>;

interface JoinHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: JoinHouseholdVariables): MutationRef<JoinHouseholdData, JoinHouseholdVariables>;
}
export const joinHouseholdRef: JoinHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
joinHousehold(dc: DataConnect, vars: JoinHouseholdVariables): MutationPromise<JoinHouseholdData, JoinHouseholdVariables>;

interface JoinHouseholdRef {
  ...
  (dc: DataConnect, vars: JoinHouseholdVariables): MutationRef<JoinHouseholdData, JoinHouseholdVariables>;
}
export const joinHouseholdRef: JoinHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the joinHouseholdRef:
```typescript
const name = joinHouseholdRef.operationName;
console.log(name);
```

### Variables
The `JoinHousehold` mutation requires an argument of type `JoinHouseholdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface JoinHouseholdVariables {
  inviteCode: string;
}
```
### Return Type
Recall that executing the `JoinHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `JoinHouseholdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface JoinHouseholdData {
  member_upsert: Member_Key;
}
```
### Using `JoinHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, joinHousehold, JoinHouseholdVariables } from '@pocketbook/dataconnect';

// The `JoinHousehold` mutation requires an argument of type `JoinHouseholdVariables`:
const joinHouseholdVars: JoinHouseholdVariables = {
  inviteCode: ..., 
};

// Call the `joinHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await joinHousehold(joinHouseholdVars);
// Variables can be defined inline as well.
const { data } = await joinHousehold({ inviteCode: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await joinHousehold(dataConnect, joinHouseholdVars);

console.log(data.member_upsert);

// Or, you can use the `Promise` API.
joinHousehold(joinHouseholdVars).then((response) => {
  const data = response.data;
  console.log(data.member_upsert);
});
```

### Using `JoinHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, joinHouseholdRef, JoinHouseholdVariables } from '@pocketbook/dataconnect';

// The `JoinHousehold` mutation requires an argument of type `JoinHouseholdVariables`:
const joinHouseholdVars: JoinHouseholdVariables = {
  inviteCode: ..., 
};

// Call the `joinHouseholdRef()` function to get a reference to the mutation.
const ref = joinHouseholdRef(joinHouseholdVars);
// Variables can be defined inline as well.
const ref = joinHouseholdRef({ inviteCode: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = joinHouseholdRef(dataConnect, joinHouseholdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.member_upsert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.member_upsert);
});
```

## LeaveHousehold
You can execute the `LeaveHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
leaveHousehold(): MutationPromise<LeaveHouseholdData, undefined>;

interface LeaveHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): MutationRef<LeaveHouseholdData, undefined>;
}
export const leaveHouseholdRef: LeaveHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
leaveHousehold(dc: DataConnect): MutationPromise<LeaveHouseholdData, undefined>;

interface LeaveHouseholdRef {
  ...
  (dc: DataConnect): MutationRef<LeaveHouseholdData, undefined>;
}
export const leaveHouseholdRef: LeaveHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the leaveHouseholdRef:
```typescript
const name = leaveHouseholdRef.operationName;
console.log(name);
```

### Variables
The `LeaveHousehold` mutation has no variables.
### Return Type
Recall that executing the `LeaveHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `LeaveHouseholdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface LeaveHouseholdData {
  member_delete?: Member_Key | null;
}
```
### Using `LeaveHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, leaveHousehold } from '@pocketbook/dataconnect';


// Call the `leaveHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await leaveHousehold();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await leaveHousehold(dataConnect);

console.log(data.member_delete);

// Or, you can use the `Promise` API.
leaveHousehold().then((response) => {
  const data = response.data;
  console.log(data.member_delete);
});
```

### Using `LeaveHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, leaveHouseholdRef } from '@pocketbook/dataconnect';


// Call the `leaveHouseholdRef()` function to get a reference to the mutation.
const ref = leaveHouseholdRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = leaveHouseholdRef(dataConnect);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.member_delete);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.member_delete);
});
```

## UpdateHousehold
You can execute the `UpdateHousehold` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateHousehold(vars: UpdateHouseholdVariables): MutationPromise<UpdateHouseholdData, UpdateHouseholdVariables>;

interface UpdateHouseholdRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateHouseholdVariables): MutationRef<UpdateHouseholdData, UpdateHouseholdVariables>;
}
export const updateHouseholdRef: UpdateHouseholdRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateHousehold(dc: DataConnect, vars: UpdateHouseholdVariables): MutationPromise<UpdateHouseholdData, UpdateHouseholdVariables>;

interface UpdateHouseholdRef {
  ...
  (dc: DataConnect, vars: UpdateHouseholdVariables): MutationRef<UpdateHouseholdData, UpdateHouseholdVariables>;
}
export const updateHouseholdRef: UpdateHouseholdRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateHouseholdRef:
```typescript
const name = updateHouseholdRef.operationName;
console.log(name);
```

### Variables
The `UpdateHousehold` mutation requires an argument of type `UpdateHouseholdVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateHouseholdVariables {
  name: string;
  currency: string;
}
```
### Return Type
Recall that executing the `UpdateHousehold` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateHouseholdData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateHouseholdData {
  household_updateMany: number;
}
```
### Using `UpdateHousehold`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateHousehold, UpdateHouseholdVariables } from '@pocketbook/dataconnect';

// The `UpdateHousehold` mutation requires an argument of type `UpdateHouseholdVariables`:
const updateHouseholdVars: UpdateHouseholdVariables = {
  name: ..., 
  currency: ..., 
};

// Call the `updateHousehold()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateHousehold(updateHouseholdVars);
// Variables can be defined inline as well.
const { data } = await updateHousehold({ name: ..., currency: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateHousehold(dataConnect, updateHouseholdVars);

console.log(data.household_updateMany);

// Or, you can use the `Promise` API.
updateHousehold(updateHouseholdVars).then((response) => {
  const data = response.data;
  console.log(data.household_updateMany);
});
```

### Using `UpdateHousehold`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateHouseholdRef, UpdateHouseholdVariables } from '@pocketbook/dataconnect';

// The `UpdateHousehold` mutation requires an argument of type `UpdateHouseholdVariables`:
const updateHouseholdVars: UpdateHouseholdVariables = {
  name: ..., 
  currency: ..., 
};

// Call the `updateHouseholdRef()` function to get a reference to the mutation.
const ref = updateHouseholdRef(updateHouseholdVars);
// Variables can be defined inline as well.
const ref = updateHouseholdRef({ name: ..., currency: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateHouseholdRef(dataConnect, updateHouseholdVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.household_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.household_updateMany);
});
```

## RemoveMember
You can execute the `RemoveMember` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
removeMember(vars: RemoveMemberVariables): MutationPromise<RemoveMemberData, RemoveMemberVariables>;

interface RemoveMemberRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: RemoveMemberVariables): MutationRef<RemoveMemberData, RemoveMemberVariables>;
}
export const removeMemberRef: RemoveMemberRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
removeMember(dc: DataConnect, vars: RemoveMemberVariables): MutationPromise<RemoveMemberData, RemoveMemberVariables>;

interface RemoveMemberRef {
  ...
  (dc: DataConnect, vars: RemoveMemberVariables): MutationRef<RemoveMemberData, RemoveMemberVariables>;
}
export const removeMemberRef: RemoveMemberRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the removeMemberRef:
```typescript
const name = removeMemberRef.operationName;
console.log(name);
```

### Variables
The `RemoveMember` mutation requires an argument of type `RemoveMemberVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface RemoveMemberVariables {
  userId: string;
}
```
### Return Type
Recall that executing the `RemoveMember` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `RemoveMemberData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface RemoveMemberData {
  member_deleteMany: number;
}
```
### Using `RemoveMember`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, removeMember, RemoveMemberVariables } from '@pocketbook/dataconnect';

// The `RemoveMember` mutation requires an argument of type `RemoveMemberVariables`:
const removeMemberVars: RemoveMemberVariables = {
  userId: ..., 
};

// Call the `removeMember()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await removeMember(removeMemberVars);
// Variables can be defined inline as well.
const { data } = await removeMember({ userId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await removeMember(dataConnect, removeMemberVars);

console.log(data.member_deleteMany);

// Or, you can use the `Promise` API.
removeMember(removeMemberVars).then((response) => {
  const data = response.data;
  console.log(data.member_deleteMany);
});
```

### Using `RemoveMember`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, removeMemberRef, RemoveMemberVariables } from '@pocketbook/dataconnect';

// The `RemoveMember` mutation requires an argument of type `RemoveMemberVariables`:
const removeMemberVars: RemoveMemberVariables = {
  userId: ..., 
};

// Call the `removeMemberRef()` function to get a reference to the mutation.
const ref = removeMemberRef(removeMemberVars);
// Variables can be defined inline as well.
const ref = removeMemberRef({ userId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = removeMemberRef(dataConnect, removeMemberVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.member_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.member_deleteMany);
});
```

## AddPaymentMethod
You can execute the `AddPaymentMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addPaymentMethod(vars: AddPaymentMethodVariables): MutationPromise<AddPaymentMethodData, AddPaymentMethodVariables>;

interface AddPaymentMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddPaymentMethodVariables): MutationRef<AddPaymentMethodData, AddPaymentMethodVariables>;
}
export const addPaymentMethodRef: AddPaymentMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addPaymentMethod(dc: DataConnect, vars: AddPaymentMethodVariables): MutationPromise<AddPaymentMethodData, AddPaymentMethodVariables>;

interface AddPaymentMethodRef {
  ...
  (dc: DataConnect, vars: AddPaymentMethodVariables): MutationRef<AddPaymentMethodData, AddPaymentMethodVariables>;
}
export const addPaymentMethodRef: AddPaymentMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addPaymentMethodRef:
```typescript
const name = addPaymentMethodRef.operationName;
console.log(name);
```

### Variables
The `AddPaymentMethod` mutation requires an argument of type `AddPaymentMethodVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddPaymentMethodVariables {
  name: string;
  type: string;
  creditLimit?: number | null;
  lastStatementBalance?: number | null;
  lastStatementDate?: DateString | null;
  paymentDueDate?: DateString | null;
  sortOrder?: number | null;
}
```
### Return Type
Recall that executing the `AddPaymentMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddPaymentMethodData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddPaymentMethodData {
  paymentMethod_insert: PaymentMethod_Key;
}
```
### Using `AddPaymentMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addPaymentMethod, AddPaymentMethodVariables } from '@pocketbook/dataconnect';

// The `AddPaymentMethod` mutation requires an argument of type `AddPaymentMethodVariables`:
const addPaymentMethodVars: AddPaymentMethodVariables = {
  name: ..., 
  type: ..., 
  creditLimit: ..., // optional
  lastStatementBalance: ..., // optional
  lastStatementDate: ..., // optional
  paymentDueDate: ..., // optional
  sortOrder: ..., // optional
};

// Call the `addPaymentMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addPaymentMethod(addPaymentMethodVars);
// Variables can be defined inline as well.
const { data } = await addPaymentMethod({ name: ..., type: ..., creditLimit: ..., lastStatementBalance: ..., lastStatementDate: ..., paymentDueDate: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addPaymentMethod(dataConnect, addPaymentMethodVars);

console.log(data.paymentMethod_insert);

// Or, you can use the `Promise` API.
addPaymentMethod(addPaymentMethodVars).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_insert);
});
```

### Using `AddPaymentMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addPaymentMethodRef, AddPaymentMethodVariables } from '@pocketbook/dataconnect';

// The `AddPaymentMethod` mutation requires an argument of type `AddPaymentMethodVariables`:
const addPaymentMethodVars: AddPaymentMethodVariables = {
  name: ..., 
  type: ..., 
  creditLimit: ..., // optional
  lastStatementBalance: ..., // optional
  lastStatementDate: ..., // optional
  paymentDueDate: ..., // optional
  sortOrder: ..., // optional
};

// Call the `addPaymentMethodRef()` function to get a reference to the mutation.
const ref = addPaymentMethodRef(addPaymentMethodVars);
// Variables can be defined inline as well.
const ref = addPaymentMethodRef({ name: ..., type: ..., creditLimit: ..., lastStatementBalance: ..., lastStatementDate: ..., paymentDueDate: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addPaymentMethodRef(dataConnect, addPaymentMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.paymentMethod_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_insert);
});
```

## UpdatePaymentMethod
You can execute the `UpdatePaymentMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updatePaymentMethod(vars: UpdatePaymentMethodVariables): MutationPromise<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;

interface UpdatePaymentMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdatePaymentMethodVariables): MutationRef<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;
}
export const updatePaymentMethodRef: UpdatePaymentMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updatePaymentMethod(dc: DataConnect, vars: UpdatePaymentMethodVariables): MutationPromise<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;

interface UpdatePaymentMethodRef {
  ...
  (dc: DataConnect, vars: UpdatePaymentMethodVariables): MutationRef<UpdatePaymentMethodData, UpdatePaymentMethodVariables>;
}
export const updatePaymentMethodRef: UpdatePaymentMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updatePaymentMethodRef:
```typescript
const name = updatePaymentMethodRef.operationName;
console.log(name);
```

### Variables
The `UpdatePaymentMethod` mutation requires an argument of type `UpdatePaymentMethodVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdatePaymentMethodVariables {
  id: UUIDString;
  name: string;
  type: string;
  creditLimit?: number | null;
  lastStatementBalance?: number | null;
  lastStatementDate?: DateString | null;
  paymentDueDate?: DateString | null;
}
```
### Return Type
Recall that executing the `UpdatePaymentMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdatePaymentMethodData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdatePaymentMethodData {
  paymentMethod_updateMany: number;
}
```
### Using `UpdatePaymentMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updatePaymentMethod, UpdatePaymentMethodVariables } from '@pocketbook/dataconnect';

// The `UpdatePaymentMethod` mutation requires an argument of type `UpdatePaymentMethodVariables`:
const updatePaymentMethodVars: UpdatePaymentMethodVariables = {
  id: ..., 
  name: ..., 
  type: ..., 
  creditLimit: ..., // optional
  lastStatementBalance: ..., // optional
  lastStatementDate: ..., // optional
  paymentDueDate: ..., // optional
};

// Call the `updatePaymentMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updatePaymentMethod(updatePaymentMethodVars);
// Variables can be defined inline as well.
const { data } = await updatePaymentMethod({ id: ..., name: ..., type: ..., creditLimit: ..., lastStatementBalance: ..., lastStatementDate: ..., paymentDueDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updatePaymentMethod(dataConnect, updatePaymentMethodVars);

console.log(data.paymentMethod_updateMany);

// Or, you can use the `Promise` API.
updatePaymentMethod(updatePaymentMethodVars).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_updateMany);
});
```

### Using `UpdatePaymentMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updatePaymentMethodRef, UpdatePaymentMethodVariables } from '@pocketbook/dataconnect';

// The `UpdatePaymentMethod` mutation requires an argument of type `UpdatePaymentMethodVariables`:
const updatePaymentMethodVars: UpdatePaymentMethodVariables = {
  id: ..., 
  name: ..., 
  type: ..., 
  creditLimit: ..., // optional
  lastStatementBalance: ..., // optional
  lastStatementDate: ..., // optional
  paymentDueDate: ..., // optional
};

// Call the `updatePaymentMethodRef()` function to get a reference to the mutation.
const ref = updatePaymentMethodRef(updatePaymentMethodVars);
// Variables can be defined inline as well.
const ref = updatePaymentMethodRef({ id: ..., name: ..., type: ..., creditLimit: ..., lastStatementBalance: ..., lastStatementDate: ..., paymentDueDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updatePaymentMethodRef(dataConnect, updatePaymentMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.paymentMethod_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_updateMany);
});
```

## ArchivePaymentMethod
You can execute the `ArchivePaymentMethod` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
archivePaymentMethod(vars: ArchivePaymentMethodVariables): MutationPromise<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;

interface ArchivePaymentMethodRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchivePaymentMethodVariables): MutationRef<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;
}
export const archivePaymentMethodRef: ArchivePaymentMethodRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
archivePaymentMethod(dc: DataConnect, vars: ArchivePaymentMethodVariables): MutationPromise<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;

interface ArchivePaymentMethodRef {
  ...
  (dc: DataConnect, vars: ArchivePaymentMethodVariables): MutationRef<ArchivePaymentMethodData, ArchivePaymentMethodVariables>;
}
export const archivePaymentMethodRef: ArchivePaymentMethodRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the archivePaymentMethodRef:
```typescript
const name = archivePaymentMethodRef.operationName;
console.log(name);
```

### Variables
The `ArchivePaymentMethod` mutation requires an argument of type `ArchivePaymentMethodVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ArchivePaymentMethodVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ArchivePaymentMethod` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ArchivePaymentMethodData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ArchivePaymentMethodData {
  paymentMethod_updateMany: number;
}
```
### Using `ArchivePaymentMethod`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, archivePaymentMethod, ArchivePaymentMethodVariables } from '@pocketbook/dataconnect';

// The `ArchivePaymentMethod` mutation requires an argument of type `ArchivePaymentMethodVariables`:
const archivePaymentMethodVars: ArchivePaymentMethodVariables = {
  id: ..., 
};

// Call the `archivePaymentMethod()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await archivePaymentMethod(archivePaymentMethodVars);
// Variables can be defined inline as well.
const { data } = await archivePaymentMethod({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await archivePaymentMethod(dataConnect, archivePaymentMethodVars);

console.log(data.paymentMethod_updateMany);

// Or, you can use the `Promise` API.
archivePaymentMethod(archivePaymentMethodVars).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_updateMany);
});
```

### Using `ArchivePaymentMethod`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, archivePaymentMethodRef, ArchivePaymentMethodVariables } from '@pocketbook/dataconnect';

// The `ArchivePaymentMethod` mutation requires an argument of type `ArchivePaymentMethodVariables`:
const archivePaymentMethodVars: ArchivePaymentMethodVariables = {
  id: ..., 
};

// Call the `archivePaymentMethodRef()` function to get a reference to the mutation.
const ref = archivePaymentMethodRef(archivePaymentMethodVars);
// Variables can be defined inline as well.
const ref = archivePaymentMethodRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = archivePaymentMethodRef(dataConnect, archivePaymentMethodVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.paymentMethod_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.paymentMethod_updateMany);
});
```

## AddCategory
You can execute the `AddCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addCategory(vars: AddCategoryVariables): MutationPromise<AddCategoryData, AddCategoryVariables>;

interface AddCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddCategoryVariables): MutationRef<AddCategoryData, AddCategoryVariables>;
}
export const addCategoryRef: AddCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addCategory(dc: DataConnect, vars: AddCategoryVariables): MutationPromise<AddCategoryData, AddCategoryVariables>;

interface AddCategoryRef {
  ...
  (dc: DataConnect, vars: AddCategoryVariables): MutationRef<AddCategoryData, AddCategoryVariables>;
}
export const addCategoryRef: AddCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addCategoryRef:
```typescript
const name = addCategoryRef.operationName;
console.log(name);
```

### Variables
The `AddCategory` mutation requires an argument of type `AddCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddCategoryVariables {
  name: string;
  kind: string;
  icon?: string | null;
  sortOrder?: number | null;
}
```
### Return Type
Recall that executing the `AddCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddCategoryData {
  category_insert: Category_Key;
}
```
### Using `AddCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addCategory, AddCategoryVariables } from '@pocketbook/dataconnect';

// The `AddCategory` mutation requires an argument of type `AddCategoryVariables`:
const addCategoryVars: AddCategoryVariables = {
  name: ..., 
  kind: ..., 
  icon: ..., // optional
  sortOrder: ..., // optional
};

// Call the `addCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addCategory(addCategoryVars);
// Variables can be defined inline as well.
const { data } = await addCategory({ name: ..., kind: ..., icon: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addCategory(dataConnect, addCategoryVars);

console.log(data.category_insert);

// Or, you can use the `Promise` API.
addCategory(addCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_insert);
});
```

### Using `AddCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addCategoryRef, AddCategoryVariables } from '@pocketbook/dataconnect';

// The `AddCategory` mutation requires an argument of type `AddCategoryVariables`:
const addCategoryVars: AddCategoryVariables = {
  name: ..., 
  kind: ..., 
  icon: ..., // optional
  sortOrder: ..., // optional
};

// Call the `addCategoryRef()` function to get a reference to the mutation.
const ref = addCategoryRef(addCategoryVars);
// Variables can be defined inline as well.
const ref = addCategoryRef({ name: ..., kind: ..., icon: ..., sortOrder: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addCategoryRef(dataConnect, addCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_insert);
});
```

## UpdateCategory
You can execute the `UpdateCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateCategory(vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface UpdateCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
}
export const updateCategoryRef: UpdateCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateCategory(dc: DataConnect, vars: UpdateCategoryVariables): MutationPromise<UpdateCategoryData, UpdateCategoryVariables>;

interface UpdateCategoryRef {
  ...
  (dc: DataConnect, vars: UpdateCategoryVariables): MutationRef<UpdateCategoryData, UpdateCategoryVariables>;
}
export const updateCategoryRef: UpdateCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateCategoryRef:
```typescript
const name = updateCategoryRef.operationName;
console.log(name);
```

### Variables
The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateCategoryVariables {
  id: UUIDString;
  name: string;
  icon?: string | null;
}
```
### Return Type
Recall that executing the `UpdateCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateCategoryData {
  category_updateMany: number;
}
```
### Using `UpdateCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateCategory, UpdateCategoryVariables } from '@pocketbook/dataconnect';

// The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`:
const updateCategoryVars: UpdateCategoryVariables = {
  id: ..., 
  name: ..., 
  icon: ..., // optional
};

// Call the `updateCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateCategory(updateCategoryVars);
// Variables can be defined inline as well.
const { data } = await updateCategory({ id: ..., name: ..., icon: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateCategory(dataConnect, updateCategoryVars);

console.log(data.category_updateMany);

// Or, you can use the `Promise` API.
updateCategory(updateCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_updateMany);
});
```

### Using `UpdateCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateCategoryRef, UpdateCategoryVariables } from '@pocketbook/dataconnect';

// The `UpdateCategory` mutation requires an argument of type `UpdateCategoryVariables`:
const updateCategoryVars: UpdateCategoryVariables = {
  id: ..., 
  name: ..., 
  icon: ..., // optional
};

// Call the `updateCategoryRef()` function to get a reference to the mutation.
const ref = updateCategoryRef(updateCategoryVars);
// Variables can be defined inline as well.
const ref = updateCategoryRef({ id: ..., name: ..., icon: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateCategoryRef(dataConnect, updateCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_updateMany);
});
```

## ArchiveCategory
You can execute the `ArchiveCategory` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
archiveCategory(vars: ArchiveCategoryVariables): MutationPromise<ArchiveCategoryData, ArchiveCategoryVariables>;

interface ArchiveCategoryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: ArchiveCategoryVariables): MutationRef<ArchiveCategoryData, ArchiveCategoryVariables>;
}
export const archiveCategoryRef: ArchiveCategoryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
archiveCategory(dc: DataConnect, vars: ArchiveCategoryVariables): MutationPromise<ArchiveCategoryData, ArchiveCategoryVariables>;

interface ArchiveCategoryRef {
  ...
  (dc: DataConnect, vars: ArchiveCategoryVariables): MutationRef<ArchiveCategoryData, ArchiveCategoryVariables>;
}
export const archiveCategoryRef: ArchiveCategoryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the archiveCategoryRef:
```typescript
const name = archiveCategoryRef.operationName;
console.log(name);
```

### Variables
The `ArchiveCategory` mutation requires an argument of type `ArchiveCategoryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface ArchiveCategoryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `ArchiveCategory` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ArchiveCategoryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface ArchiveCategoryData {
  category_updateMany: number;
}
```
### Using `ArchiveCategory`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, archiveCategory, ArchiveCategoryVariables } from '@pocketbook/dataconnect';

// The `ArchiveCategory` mutation requires an argument of type `ArchiveCategoryVariables`:
const archiveCategoryVars: ArchiveCategoryVariables = {
  id: ..., 
};

// Call the `archiveCategory()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await archiveCategory(archiveCategoryVars);
// Variables can be defined inline as well.
const { data } = await archiveCategory({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await archiveCategory(dataConnect, archiveCategoryVars);

console.log(data.category_updateMany);

// Or, you can use the `Promise` API.
archiveCategory(archiveCategoryVars).then((response) => {
  const data = response.data;
  console.log(data.category_updateMany);
});
```

### Using `ArchiveCategory`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, archiveCategoryRef, ArchiveCategoryVariables } from '@pocketbook/dataconnect';

// The `ArchiveCategory` mutation requires an argument of type `ArchiveCategoryVariables`:
const archiveCategoryVars: ArchiveCategoryVariables = {
  id: ..., 
};

// Call the `archiveCategoryRef()` function to get a reference to the mutation.
const ref = archiveCategoryRef(archiveCategoryVars);
// Variables can be defined inline as well.
const ref = archiveCategoryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = archiveCategoryRef(dataConnect, archiveCategoryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.category_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.category_updateMany);
});
```

## AddEntry
You can execute the `AddEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addEntry(vars: AddEntryVariables): MutationPromise<AddEntryData, AddEntryVariables>;

interface AddEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddEntryVariables): MutationRef<AddEntryData, AddEntryVariables>;
}
export const addEntryRef: AddEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addEntry(dc: DataConnect, vars: AddEntryVariables): MutationPromise<AddEntryData, AddEntryVariables>;

interface AddEntryRef {
  ...
  (dc: DataConnect, vars: AddEntryVariables): MutationRef<AddEntryData, AddEntryVariables>;
}
export const addEntryRef: AddEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addEntryRef:
```typescript
const name = addEntryRef.operationName;
console.log(name);
```

### Variables
The `AddEntry` mutation requires an argument of type `AddEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddEntryVariables {
  kind: string;
  amount: number;
  date: DateString;
  note?: string | null;
  categoryId?: UUIDString | null;
  paymentMethodId?: UUIDString | null;
  paidCardId?: UUIDString | null;
}
```
### Return Type
Recall that executing the `AddEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddEntryData {
  entry_insert: Entry_Key;
}
```
### Using `AddEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addEntry, AddEntryVariables } from '@pocketbook/dataconnect';

// The `AddEntry` mutation requires an argument of type `AddEntryVariables`:
const addEntryVars: AddEntryVariables = {
  kind: ..., 
  amount: ..., 
  date: ..., 
  note: ..., // optional
  categoryId: ..., // optional
  paymentMethodId: ..., // optional
  paidCardId: ..., // optional
};

// Call the `addEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addEntry(addEntryVars);
// Variables can be defined inline as well.
const { data } = await addEntry({ kind: ..., amount: ..., date: ..., note: ..., categoryId: ..., paymentMethodId: ..., paidCardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addEntry(dataConnect, addEntryVars);

console.log(data.entry_insert);

// Or, you can use the `Promise` API.
addEntry(addEntryVars).then((response) => {
  const data = response.data;
  console.log(data.entry_insert);
});
```

### Using `AddEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addEntryRef, AddEntryVariables } from '@pocketbook/dataconnect';

// The `AddEntry` mutation requires an argument of type `AddEntryVariables`:
const addEntryVars: AddEntryVariables = {
  kind: ..., 
  amount: ..., 
  date: ..., 
  note: ..., // optional
  categoryId: ..., // optional
  paymentMethodId: ..., // optional
  paidCardId: ..., // optional
};

// Call the `addEntryRef()` function to get a reference to the mutation.
const ref = addEntryRef(addEntryVars);
// Variables can be defined inline as well.
const ref = addEntryRef({ kind: ..., amount: ..., date: ..., note: ..., categoryId: ..., paymentMethodId: ..., paidCardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addEntryRef(dataConnect, addEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entry_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entry_insert);
});
```

## UpdateEntry
You can execute the `UpdateEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateEntry(vars: UpdateEntryVariables): MutationPromise<UpdateEntryData, UpdateEntryVariables>;

interface UpdateEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateEntryVariables): MutationRef<UpdateEntryData, UpdateEntryVariables>;
}
export const updateEntryRef: UpdateEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateEntry(dc: DataConnect, vars: UpdateEntryVariables): MutationPromise<UpdateEntryData, UpdateEntryVariables>;

interface UpdateEntryRef {
  ...
  (dc: DataConnect, vars: UpdateEntryVariables): MutationRef<UpdateEntryData, UpdateEntryVariables>;
}
export const updateEntryRef: UpdateEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateEntryRef:
```typescript
const name = updateEntryRef.operationName;
console.log(name);
```

### Variables
The `UpdateEntry` mutation requires an argument of type `UpdateEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
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
```
### Return Type
Recall that executing the `UpdateEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateEntryData {
  entry_updateMany: number;
}
```
### Using `UpdateEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateEntry, UpdateEntryVariables } from '@pocketbook/dataconnect';

// The `UpdateEntry` mutation requires an argument of type `UpdateEntryVariables`:
const updateEntryVars: UpdateEntryVariables = {
  id: ..., 
  kind: ..., 
  amount: ..., 
  date: ..., 
  note: ..., // optional
  categoryId: ..., // optional
  paymentMethodId: ..., // optional
  paidCardId: ..., // optional
};

// Call the `updateEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateEntry(updateEntryVars);
// Variables can be defined inline as well.
const { data } = await updateEntry({ id: ..., kind: ..., amount: ..., date: ..., note: ..., categoryId: ..., paymentMethodId: ..., paidCardId: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateEntry(dataConnect, updateEntryVars);

console.log(data.entry_updateMany);

// Or, you can use the `Promise` API.
updateEntry(updateEntryVars).then((response) => {
  const data = response.data;
  console.log(data.entry_updateMany);
});
```

### Using `UpdateEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateEntryRef, UpdateEntryVariables } from '@pocketbook/dataconnect';

// The `UpdateEntry` mutation requires an argument of type `UpdateEntryVariables`:
const updateEntryVars: UpdateEntryVariables = {
  id: ..., 
  kind: ..., 
  amount: ..., 
  date: ..., 
  note: ..., // optional
  categoryId: ..., // optional
  paymentMethodId: ..., // optional
  paidCardId: ..., // optional
};

// Call the `updateEntryRef()` function to get a reference to the mutation.
const ref = updateEntryRef(updateEntryVars);
// Variables can be defined inline as well.
const ref = updateEntryRef({ id: ..., kind: ..., amount: ..., date: ..., note: ..., categoryId: ..., paymentMethodId: ..., paidCardId: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateEntryRef(dataConnect, updateEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entry_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entry_updateMany);
});
```

## DeleteEntry
You can execute the `DeleteEntry` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteEntry(vars: DeleteEntryVariables): MutationPromise<DeleteEntryData, DeleteEntryVariables>;

interface DeleteEntryRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteEntryVariables): MutationRef<DeleteEntryData, DeleteEntryVariables>;
}
export const deleteEntryRef: DeleteEntryRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteEntry(dc: DataConnect, vars: DeleteEntryVariables): MutationPromise<DeleteEntryData, DeleteEntryVariables>;

interface DeleteEntryRef {
  ...
  (dc: DataConnect, vars: DeleteEntryVariables): MutationRef<DeleteEntryData, DeleteEntryVariables>;
}
export const deleteEntryRef: DeleteEntryRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteEntryRef:
```typescript
const name = deleteEntryRef.operationName;
console.log(name);
```

### Variables
The `DeleteEntry` mutation requires an argument of type `DeleteEntryVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteEntryVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteEntry` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteEntryData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteEntryData {
  entry_deleteMany: number;
}
```
### Using `DeleteEntry`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteEntry, DeleteEntryVariables } from '@pocketbook/dataconnect';

// The `DeleteEntry` mutation requires an argument of type `DeleteEntryVariables`:
const deleteEntryVars: DeleteEntryVariables = {
  id: ..., 
};

// Call the `deleteEntry()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteEntry(deleteEntryVars);
// Variables can be defined inline as well.
const { data } = await deleteEntry({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteEntry(dataConnect, deleteEntryVars);

console.log(data.entry_deleteMany);

// Or, you can use the `Promise` API.
deleteEntry(deleteEntryVars).then((response) => {
  const data = response.data;
  console.log(data.entry_deleteMany);
});
```

### Using `DeleteEntry`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteEntryRef, DeleteEntryVariables } from '@pocketbook/dataconnect';

// The `DeleteEntry` mutation requires an argument of type `DeleteEntryVariables`:
const deleteEntryVars: DeleteEntryVariables = {
  id: ..., 
};

// Call the `deleteEntryRef()` function to get a reference to the mutation.
const ref = deleteEntryRef(deleteEntryVars);
// Variables can be defined inline as well.
const ref = deleteEntryRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteEntryRef(dataConnect, deleteEntryVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.entry_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.entry_deleteMany);
});
```

## AddInstallmentPlan
You can execute the `AddInstallmentPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
addInstallmentPlan(vars: AddInstallmentPlanVariables): MutationPromise<AddInstallmentPlanData, AddInstallmentPlanVariables>;

interface AddInstallmentPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: AddInstallmentPlanVariables): MutationRef<AddInstallmentPlanData, AddInstallmentPlanVariables>;
}
export const addInstallmentPlanRef: AddInstallmentPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
addInstallmentPlan(dc: DataConnect, vars: AddInstallmentPlanVariables): MutationPromise<AddInstallmentPlanData, AddInstallmentPlanVariables>;

interface AddInstallmentPlanRef {
  ...
  (dc: DataConnect, vars: AddInstallmentPlanVariables): MutationRef<AddInstallmentPlanData, AddInstallmentPlanVariables>;
}
export const addInstallmentPlanRef: AddInstallmentPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the addInstallmentPlanRef:
```typescript
const name = addInstallmentPlanRef.operationName;
console.log(name);
```

### Variables
The `AddInstallmentPlan` mutation requires an argument of type `AddInstallmentPlanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface AddInstallmentPlanVariables {
  cardId: UUIDString;
  description: string;
  totalAmount: number;
  months: number;
  startDate: DateString;
}
```
### Return Type
Recall that executing the `AddInstallmentPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `AddInstallmentPlanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface AddInstallmentPlanData {
  installmentPlan_insert: InstallmentPlan_Key;
}
```
### Using `AddInstallmentPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, addInstallmentPlan, AddInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `AddInstallmentPlan` mutation requires an argument of type `AddInstallmentPlanVariables`:
const addInstallmentPlanVars: AddInstallmentPlanVariables = {
  cardId: ..., 
  description: ..., 
  totalAmount: ..., 
  months: ..., 
  startDate: ..., 
};

// Call the `addInstallmentPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await addInstallmentPlan(addInstallmentPlanVars);
// Variables can be defined inline as well.
const { data } = await addInstallmentPlan({ cardId: ..., description: ..., totalAmount: ..., months: ..., startDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await addInstallmentPlan(dataConnect, addInstallmentPlanVars);

console.log(data.installmentPlan_insert);

// Or, you can use the `Promise` API.
addInstallmentPlan(addInstallmentPlanVars).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_insert);
});
```

### Using `AddInstallmentPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, addInstallmentPlanRef, AddInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `AddInstallmentPlan` mutation requires an argument of type `AddInstallmentPlanVariables`:
const addInstallmentPlanVars: AddInstallmentPlanVariables = {
  cardId: ..., 
  description: ..., 
  totalAmount: ..., 
  months: ..., 
  startDate: ..., 
};

// Call the `addInstallmentPlanRef()` function to get a reference to the mutation.
const ref = addInstallmentPlanRef(addInstallmentPlanVars);
// Variables can be defined inline as well.
const ref = addInstallmentPlanRef({ cardId: ..., description: ..., totalAmount: ..., months: ..., startDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = addInstallmentPlanRef(dataConnect, addInstallmentPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.installmentPlan_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_insert);
});
```

## UpdateInstallmentPlan
You can execute the `UpdateInstallmentPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateInstallmentPlan(vars: UpdateInstallmentPlanVariables): MutationPromise<UpdateInstallmentPlanData, UpdateInstallmentPlanVariables>;

interface UpdateInstallmentPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: UpdateInstallmentPlanVariables): MutationRef<UpdateInstallmentPlanData, UpdateInstallmentPlanVariables>;
}
export const updateInstallmentPlanRef: UpdateInstallmentPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateInstallmentPlan(dc: DataConnect, vars: UpdateInstallmentPlanVariables): MutationPromise<UpdateInstallmentPlanData, UpdateInstallmentPlanVariables>;

interface UpdateInstallmentPlanRef {
  ...
  (dc: DataConnect, vars: UpdateInstallmentPlanVariables): MutationRef<UpdateInstallmentPlanData, UpdateInstallmentPlanVariables>;
}
export const updateInstallmentPlanRef: UpdateInstallmentPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateInstallmentPlanRef:
```typescript
const name = updateInstallmentPlanRef.operationName;
console.log(name);
```

### Variables
The `UpdateInstallmentPlan` mutation requires an argument of type `UpdateInstallmentPlanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateInstallmentPlanVariables {
  id: UUIDString;
  description: string;
  totalAmount: number;
  months: number;
  startDate: DateString;
}
```
### Return Type
Recall that executing the `UpdateInstallmentPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateInstallmentPlanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateInstallmentPlanData {
  installmentPlan_updateMany: number;
}
```
### Using `UpdateInstallmentPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateInstallmentPlan, UpdateInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `UpdateInstallmentPlan` mutation requires an argument of type `UpdateInstallmentPlanVariables`:
const updateInstallmentPlanVars: UpdateInstallmentPlanVariables = {
  id: ..., 
  description: ..., 
  totalAmount: ..., 
  months: ..., 
  startDate: ..., 
};

// Call the `updateInstallmentPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateInstallmentPlan(updateInstallmentPlanVars);
// Variables can be defined inline as well.
const { data } = await updateInstallmentPlan({ id: ..., description: ..., totalAmount: ..., months: ..., startDate: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateInstallmentPlan(dataConnect, updateInstallmentPlanVars);

console.log(data.installmentPlan_updateMany);

// Or, you can use the `Promise` API.
updateInstallmentPlan(updateInstallmentPlanVars).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_updateMany);
});
```

### Using `UpdateInstallmentPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateInstallmentPlanRef, UpdateInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `UpdateInstallmentPlan` mutation requires an argument of type `UpdateInstallmentPlanVariables`:
const updateInstallmentPlanVars: UpdateInstallmentPlanVariables = {
  id: ..., 
  description: ..., 
  totalAmount: ..., 
  months: ..., 
  startDate: ..., 
};

// Call the `updateInstallmentPlanRef()` function to get a reference to the mutation.
const ref = updateInstallmentPlanRef(updateInstallmentPlanVars);
// Variables can be defined inline as well.
const ref = updateInstallmentPlanRef({ id: ..., description: ..., totalAmount: ..., months: ..., startDate: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateInstallmentPlanRef(dataConnect, updateInstallmentPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.installmentPlan_updateMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_updateMany);
});
```

## DeleteInstallmentPlan
You can execute the `DeleteInstallmentPlan` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
deleteInstallmentPlan(vars: DeleteInstallmentPlanVariables): MutationPromise<DeleteInstallmentPlanData, DeleteInstallmentPlanVariables>;

interface DeleteInstallmentPlanRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: DeleteInstallmentPlanVariables): MutationRef<DeleteInstallmentPlanData, DeleteInstallmentPlanVariables>;
}
export const deleteInstallmentPlanRef: DeleteInstallmentPlanRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
deleteInstallmentPlan(dc: DataConnect, vars: DeleteInstallmentPlanVariables): MutationPromise<DeleteInstallmentPlanData, DeleteInstallmentPlanVariables>;

interface DeleteInstallmentPlanRef {
  ...
  (dc: DataConnect, vars: DeleteInstallmentPlanVariables): MutationRef<DeleteInstallmentPlanData, DeleteInstallmentPlanVariables>;
}
export const deleteInstallmentPlanRef: DeleteInstallmentPlanRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the deleteInstallmentPlanRef:
```typescript
const name = deleteInstallmentPlanRef.operationName;
console.log(name);
```

### Variables
The `DeleteInstallmentPlan` mutation requires an argument of type `DeleteInstallmentPlanVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface DeleteInstallmentPlanVariables {
  id: UUIDString;
}
```
### Return Type
Recall that executing the `DeleteInstallmentPlan` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `DeleteInstallmentPlanData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface DeleteInstallmentPlanData {
  installmentPlan_deleteMany: number;
}
```
### Using `DeleteInstallmentPlan`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, deleteInstallmentPlan, DeleteInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `DeleteInstallmentPlan` mutation requires an argument of type `DeleteInstallmentPlanVariables`:
const deleteInstallmentPlanVars: DeleteInstallmentPlanVariables = {
  id: ..., 
};

// Call the `deleteInstallmentPlan()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await deleteInstallmentPlan(deleteInstallmentPlanVars);
// Variables can be defined inline as well.
const { data } = await deleteInstallmentPlan({ id: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await deleteInstallmentPlan(dataConnect, deleteInstallmentPlanVars);

console.log(data.installmentPlan_deleteMany);

// Or, you can use the `Promise` API.
deleteInstallmentPlan(deleteInstallmentPlanVars).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_deleteMany);
});
```

### Using `DeleteInstallmentPlan`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, deleteInstallmentPlanRef, DeleteInstallmentPlanVariables } from '@pocketbook/dataconnect';

// The `DeleteInstallmentPlan` mutation requires an argument of type `DeleteInstallmentPlanVariables`:
const deleteInstallmentPlanVars: DeleteInstallmentPlanVariables = {
  id: ..., 
};

// Call the `deleteInstallmentPlanRef()` function to get a reference to the mutation.
const ref = deleteInstallmentPlanRef(deleteInstallmentPlanVars);
// Variables can be defined inline as well.
const ref = deleteInstallmentPlanRef({ id: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = deleteInstallmentPlanRef(dataConnect, deleteInstallmentPlanVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.installmentPlan_deleteMany);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.installmentPlan_deleteMany);
});
```


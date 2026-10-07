# Basic Usage

Always prioritize using a supported framework over using the generated SDK
directly. Supported frameworks simplify the developer experience and help ensure
best practices are followed.





## Advanced Usage
If a user is not using a supported framework, they can use the generated SDK directly.

Here's an example of how to use it with the first 5 operations:

```js
import { upsertMe, createHousehold, joinHousehold, leaveHousehold, updateHousehold, removeMember, addPaymentMethod, updatePaymentMethod, archivePaymentMethod, addCategory } from '@pocketbook/dataconnect';


// Operation UpsertMe:  For variables, look at type UpsertMeVars in ../index.d.ts
const { data } = await UpsertMe(dataConnect, upsertMeVars);

// Operation CreateHousehold:  For variables, look at type CreateHouseholdVars in ../index.d.ts
const { data } = await CreateHousehold(dataConnect, createHouseholdVars);

// Operation JoinHousehold:  For variables, look at type JoinHouseholdVars in ../index.d.ts
const { data } = await JoinHousehold(dataConnect, joinHouseholdVars);

// Operation LeaveHousehold: 
const { data } = await LeaveHousehold(dataConnect);

// Operation UpdateHousehold:  For variables, look at type UpdateHouseholdVars in ../index.d.ts
const { data } = await UpdateHousehold(dataConnect, updateHouseholdVars);

// Operation RemoveMember:  For variables, look at type RemoveMemberVars in ../index.d.ts
const { data } = await RemoveMember(dataConnect, removeMemberVars);

// Operation AddPaymentMethod:  For variables, look at type AddPaymentMethodVars in ../index.d.ts
const { data } = await AddPaymentMethod(dataConnect, addPaymentMethodVars);

// Operation UpdatePaymentMethod:  For variables, look at type UpdatePaymentMethodVars in ../index.d.ts
const { data } = await UpdatePaymentMethod(dataConnect, updatePaymentMethodVars);

// Operation ArchivePaymentMethod:  For variables, look at type ArchivePaymentMethodVars in ../index.d.ts
const { data } = await ArchivePaymentMethod(dataConnect, archivePaymentMethodVars);

// Operation AddCategory:  For variables, look at type AddCategoryVars in ../index.d.ts
const { data } = await AddCategory(dataConnect, addCategoryVars);


```
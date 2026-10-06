const { queryRef, executeQuery, validateArgsWithOptions, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'pocketbook',
  service: 'pocketbook',
  location: 'us-east4'
};
exports.connectorConfig = connectorConfig;

const upsertMeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpsertMe', inputVars);
}
upsertMeRef.operationName = 'UpsertMe';
exports.upsertMeRef = upsertMeRef;

exports.upsertMe = function upsertMe(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(upsertMeRef(dcInstance, inputVars));
}
;

const createHouseholdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateHousehold', inputVars);
}
createHouseholdRef.operationName = 'CreateHousehold';
exports.createHouseholdRef = createHouseholdRef;

exports.createHousehold = function createHousehold(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(createHouseholdRef(dcInstance, inputVars));
}
;

const joinHouseholdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'JoinHousehold', inputVars);
}
joinHouseholdRef.operationName = 'JoinHousehold';
exports.joinHouseholdRef = joinHouseholdRef;

exports.joinHousehold = function joinHousehold(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(joinHouseholdRef(dcInstance, inputVars));
}
;

const leaveHouseholdRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'LeaveHousehold');
}
leaveHouseholdRef.operationName = 'LeaveHousehold';
exports.leaveHouseholdRef = leaveHouseholdRef;

exports.leaveHousehold = function leaveHousehold(dc) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dc, undefined);
  return executeMutation(leaveHouseholdRef(dcInstance, inputVars));
}
;

const updateHouseholdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateHousehold', inputVars);
}
updateHouseholdRef.operationName = 'UpdateHousehold';
exports.updateHouseholdRef = updateHouseholdRef;

exports.updateHousehold = function updateHousehold(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateHouseholdRef(dcInstance, inputVars));
}
;

const removeMemberRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveMember', inputVars);
}
removeMemberRef.operationName = 'RemoveMember';
exports.removeMemberRef = removeMemberRef;

exports.removeMember = function removeMember(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(removeMemberRef(dcInstance, inputVars));
}
;

const addPaymentMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPaymentMethod', inputVars);
}
addPaymentMethodRef.operationName = 'AddPaymentMethod';
exports.addPaymentMethodRef = addPaymentMethodRef;

exports.addPaymentMethod = function addPaymentMethod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addPaymentMethodRef(dcInstance, inputVars));
}
;

const updatePaymentMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePaymentMethod', inputVars);
}
updatePaymentMethodRef.operationName = 'UpdatePaymentMethod';
exports.updatePaymentMethodRef = updatePaymentMethodRef;

exports.updatePaymentMethod = function updatePaymentMethod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updatePaymentMethodRef(dcInstance, inputVars));
}
;

const archivePaymentMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ArchivePaymentMethod', inputVars);
}
archivePaymentMethodRef.operationName = 'ArchivePaymentMethod';
exports.archivePaymentMethodRef = archivePaymentMethodRef;

exports.archivePaymentMethod = function archivePaymentMethod(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(archivePaymentMethodRef(dcInstance, inputVars));
}
;

const addCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddCategory', inputVars);
}
addCategoryRef.operationName = 'AddCategory';
exports.addCategoryRef = addCategoryRef;

exports.addCategory = function addCategory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addCategoryRef(dcInstance, inputVars));
}
;

const updateCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateCategory', inputVars);
}
updateCategoryRef.operationName = 'UpdateCategory';
exports.updateCategoryRef = updateCategoryRef;

exports.updateCategory = function updateCategory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateCategoryRef(dcInstance, inputVars));
}
;

const archiveCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'ArchiveCategory', inputVars);
}
archiveCategoryRef.operationName = 'ArchiveCategory';
exports.archiveCategoryRef = archiveCategoryRef;

exports.archiveCategory = function archiveCategory(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(archiveCategoryRef(dcInstance, inputVars));
}
;

const addEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddEntry', inputVars);
}
addEntryRef.operationName = 'AddEntry';
exports.addEntryRef = addEntryRef;

exports.addEntry = function addEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(addEntryRef(dcInstance, inputVars));
}
;

const updateEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateEntry', inputVars);
}
updateEntryRef.operationName = 'UpdateEntry';
exports.updateEntryRef = updateEntryRef;

exports.updateEntry = function updateEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(updateEntryRef(dcInstance, inputVars));
}
;

const deleteEntryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteEntry', inputVars);
}
deleteEntryRef.operationName = 'DeleteEntry';
exports.deleteEntryRef = deleteEntryRef;

exports.deleteEntry = function deleteEntry(dcOrVars, vars) {
  const { dc: dcInstance, vars: inputVars } = validateArgs(connectorConfig, dcOrVars, vars, true);
  return executeMutation(deleteEntryRef(dcInstance, inputVars));
}
;

const getMyHomeRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyHome');
}
getMyHomeRef.operationName = 'GetMyHome';
exports.getMyHomeRef = getMyHomeRef;

exports.getMyHome = function getMyHome(dcOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrOptions, options, undefined,false, false);
  return executeQuery(getMyHomeRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const listEntriesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'ListEntries', inputVars);
}
listEntriesRef.operationName = 'ListEntries';
exports.listEntriesRef = listEntriesRef;

exports.listEntries = function listEntries(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(listEntriesRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

const cardActivityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'CardActivity', inputVars);
}
cardActivityRef.operationName = 'CardActivity';
exports.cardActivityRef = cardActivityRef;

exports.cardActivity = function cardActivity(dcOrVars, varsOrOptions, options) {
  
  const { dc: dcInstance, vars: inputVars, options: inputOpts } = validateArgsWithOptions(connectorConfig, dcOrVars, varsOrOptions, options, true, true);
  return executeQuery(cardActivityRef(dcInstance, inputVars), inputOpts && { fetchPolicy: inputOpts.fetchPolicy });
}
;

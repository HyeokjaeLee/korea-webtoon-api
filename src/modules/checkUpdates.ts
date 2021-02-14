export const checkUpdates = (api_name: string, data: any): void => {
  console.log(`\n------------------------${new Date()}------------------------\n`);
  if (data != undefined) {
    console.log(`${api_name} data has been updated successfully.`);
  } else {
    console.log(`${api_name} data update failed.`);
  }
};

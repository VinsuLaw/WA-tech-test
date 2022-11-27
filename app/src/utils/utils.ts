export const toISO = (stamp: string): string => {
  let datetime = new Date(stamp).toISOString().split(".")[0];
  return datetime;
};

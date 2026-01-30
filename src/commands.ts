type HandleRunCommand = {
  olderThan: string;
};

export const handleRunCommand = async ({ olderThan }: HandleRunCommand) => {
  console.log({ olderThan });
  const olderThanNumber = Number(olderThan);
  console.log(
    `Running web-quote-emailer for quotes older than ${olderThanNumber} minutes...`,
  );
};

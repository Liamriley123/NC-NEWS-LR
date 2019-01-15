const formatToDate = (ts) => {
  const day = new Date(ts).getDate();
  let month = new Date(ts).getMonth() + 1;
  const year = new Date(ts).getFullYear();

  if (month < 10) month = `0${month}`;

  const finalDate = `${year}-${month}-${day}`;
  return finalDate;
};

exports.formatData = ({ created_at, created_by, ...oldData }) => {
  const newData = {
    ...oldData,
    created_at: formatToDate(created_at),
    username: created_by,
  };
  return newData;
};

exports.formatComments = (comments, lookup) => comments.map((comment) => {
  const copyComment = { ...comment };
  copyComment.created_at = formatToDate(comment.created_at);
  copyComment.username = comment.created_by;
  copyComment.article_id = lookup[comment.belongs_to];
  delete copyComment.created_by;
  delete copyComment.belongs_to;
  return copyComment;
});

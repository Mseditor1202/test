export default function handler(req, res) {
  const hasUri = !!process.env.MONGODB_URI;
  res.status(200).json({
    hasUri, // trueならOK、falseなら環境変数が読めてない
    preview: hasUri ? process.env.MONGODB_URI.slice(0, 25) + "..." : null, // 値の先頭だけ安全に確認
    nodeEnv: process.env.NODE_ENV,
  });
}
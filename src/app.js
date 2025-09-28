const express = require('express');
const healthRouter = require('./routes/health');

const app = express();
const port = process.env.PORT || 3000;

// JSON 미들웨어 설정
app.use(express.json());

// 라우터 설정
app.use('/health', healthRouter);

// 서버 시작
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

module.exports = app;

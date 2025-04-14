FROM node:20-alpine3.19

# ❌ 不要設定 NODE_ENV=production，否則 devDependencies 不會安裝
# ENV NODE_ENV=production

WORKDIR /app

COPY package*.json ./

# ✅ 安裝所有依賴（含 devDependencies）
RUN npm install

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["node", "dist/server.js"]

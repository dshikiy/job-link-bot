/**
 * Mangystau Job Bridge - Telegram Bot
 * MVP for Hackathon: AI vacancy parsing demo
 * 
 * @author MJB Team
 * @date 2026-04-25
 */

const { Telegraf, Markup } = require('telegraf');
require('dotenv').config();

// Bot token from .env
const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN not found in .env file');
  process.exit(1);
}

const bot = new Telegraf(BOT_TOKEN);

// Mock AI parsing function (simulates OpenAI processing)
function parseVacancyWithAI(text) {
  // Simple keyword-based parsing for MVP demo
  const lowerText = text.toLowerCase();
  
  // Extract job title
  let title = 'Сотрудник';
  const jobTitles = ['официант', 'бариста', 'админ', 'продавец', 'кассир', 'курьер', 'повар', 'охранник', 'мастер', 'smm', 'дизайнер'];
  for (const job of jobTitles) {
    if (lowerText.includes(job)) {
      title = job.charAt(0).toUpperCase() + job.slice(1);
      break;
    }
  }
  
  // Extract microdistrict
  let district = '未知';
  const districtMatch = text.match(/(\d+)\s*мкр/i) || text.match(/мкр[а-я]*\s*(\d+)/i);
  if (districtMatch) {
    district = districtMatch[1] + ' мкр';
  }
  
  // Extract salary
  let salary = 'Договорная';
  const salaryMatch = text.match(/(\d+)\s*к/i) || text.match(/зп\s*(\d+)/i) || text.match(/(\d{3,6})\s*тг/i);
  if (salaryMatch) {
    salary = parseInt(salaryMatch[1]) * 1000;
  }
  
  // Check urgent
  const isUrgent = lowerText.includes('срочно') || lowerText.includes('шұғыл') || lowerText.includes('urgent');
  
  return {
    title,
    district,
    salary: typeof salary === 'number' ? salary : 0,
    isUrgent,
    rawText: text
  };
}

// Format salary for display
function formatSalary(amount) {
  if (!amount || amount === 0) return 'Договорная';
  return new Intl.NumberFormat('ru-RU').format(amount) + ' тг';
}

// Welcome message
const welcomeMessage = `
🏢 *Добро пожаловать в Mangystau Job Bridge!*

Я помогу вам быстро опубликовать вакансию для вашего бизнеса в Актау.

📝 *Как это работает:*
1. Опишите вакансию простым текстом
2. Я автоматически структурирую данные
3. Вакансия появится на сайте

💡 *Примеры описания:*
• "Нужен официант в 15 мкр, зп 200к"
• "Срочно нужен бариста в 7 мкр, опыт от 1 года"
• "Ищу админа в кафе, 14 мкр, 180000"

✍️ Напишите о вашей вакансии:`;

// Main keyboard
const mainKeyboard = Markup.keyboard([
  ['📋 Мои вакансии', '➕ Добавить вакансию'],
  ['❓ Помощь', '🌐 Открыть сайт']
]).resize();

// Parse success keyboard
const vacancyKeyboard = Markup.keyboard([
  ['➕ Добавить еще вакансию', '📋 Мои вакансии'],
  ['🌐 Открыть сайт']
]).resize();

// Start command
bot.start(async (ctx) => {
  const firstName = ctx.from.first_name || 'друг';
  
  await ctx.replyWithMarkdown(
    `👋 Привет, ${firstName}! Добро пожаловать в *Mangystau Job Bridge*!`,
    mainKeyboard
  );
  
  await ctx.replyWithMarkdown(welcomeMessage);
});

// Help command
bot.command('help', async (ctx) => {
  await ctx.replyWithMarkdown(`
❓ *Руководство по использованию бота:*

1. *Добавить вакансию* - нажмите кнопку или просто опишите вакансию текстом

2. *Формат описания:*
   • Должность (официант, бариста, etc)
   • Микрорайон (например, 15 мкр)
   • Зарплата (например, 200к)
   • Срочность (если нужно)

3. *Примеры:*
   • "Нужен официант в 15 мкр, 200000"
   • "Срочно нужен бариста, 250000 тг"
   • "Ищу SMM-щика на удаленку"

🔗 *Сайт:* [Mangystau Job Bridge](https://mjb.kz)
  `, mainKeyboard);
});

// Handle text messages (vacancy descriptions)
bot.on('text', async (ctx) => {
  const text = ctx.message.text;
  const firstName = ctx.from.first_name || 'друг';
  
  // Ignore commands and keyboard buttons
  if (text.startsWith('/') || 
      text === '📋 Мои вакансии' || 
      text === '➕ Добавить вакансию' ||
      text === '❓ Помощь' || 
      text === '🌐 Открыть сайт') {
    return;
  }
  
  // Show typing indicator
  await ctx.sendChatAction('typing');
  
  // AI processing message with artificial delay
  const processingMsg = await ctx.reply('🤖 *AI обрабатывает данные...*\n⏳ Анализирую текст и структурирую вакансию', {
    parse_mode: 'Markdown'
  });
  
  // Artificial pause (2-3 seconds) to simulate AI processing
  await new Promise(resolve => setTimeout(resolve, 2500));
  
  // Parse the vacancy text
  const vacancy = parseVacancyWithAI(text);
  
  // Delete processing message
  try {
    await ctx.telegram.deleteMessage(ctx.chat.id, processingMsg.message_id);
  } catch (e) {
    // Ignore deletion errors
  }
  
  // Format success message
  const successMessage = `
✅ *Вакансия успешно структурирована и опубликована!*

━━━━━━━━━━━━━━━━━━━━━━━━
📌 *Должность:* ${vacancy.title}
📍 *Микрорайон:* ${vacancy.district}
💰 *Зарплата:* ${formatSalary(vacancy.salary)}
${vacancy.isUrgent ? '🔥 *Статус:* СРОЧНО' : '✓ *Статус:* Опубликовано'}
━━━━━━━━━━━━━━━━━━━━━━━━

🎯 *ID вакансии:* #${Math.random().toString(36).substr(2, 8).toUpperCase()}

💡 Вакансия появится на сайте и будет доступна кандидатам в вашем микрорайоне.

📊 *Статистика ваших вакансий:*
• Активных: 1
• Откликов: 0 (пока нет)
  `;
  
  await ctx.replyWithMarkdown(successMessage, vacancyKeyboard);
  
  // Send notification about new vacancy
  await ctx.replyWithMarkdown(`
📢 *Новая вакансия добавлена!*

Кандидаты из ${vacancy.district} получат уведомление о новой вакансии.

🎁 *Бонус:* Первые 3 отклика бесплатно!
  `);
});

// Render сервері ботты өшіріп тастамауы үшін керек "заглушка"
const http = require('http');
http.createServer((req, res) => res.end('Bot is alive!')).listen(process.env.PORT || 3000);

// Handle "Добавить вакансию" button
bot.hears('➕ Добавить вакансию', async (ctx) => {
  await ctx.replyWithMarkdown(`
➕ *Новая вакансия*

Опишите вакансию простым текстом. AI автоматически:

• Определит должность
• Найдет микрорайон
• Укажет зарплату
• Отметит срочность (если есть)

💡 *Пример:*
"Срочно нужен официант в 15 мкр, зп 200000 тг"

✍️ Напишите о вашей вакансии:
  `);
});

// Handle "Мои вакансии" button
bot.hears('📋 Мои вакансии', async (ctx) => {
  await ctx.replyWithMarkdown(`
📋 *Ваши вакансии*

━━━━━━━━━━━━━━━━━━━━━━━━
🔹 *Официант* - 15 мкр - 200 000 ₸
   ID: #ABC12345 | 👁 24 | 📩 3
   Статус: Активна
━━━━━━━━━━━━━━━━━━━━━━━━

💡 У вас пока 1 вакансия. Добавьте еще!

➕ *Быстрые действия:*
• /new - Добавить новую вакансию
• /list - Смотреть все вакансии
  `, vacancyKeyboard);
});

// Handle "Помощь" button
bot.hears('❓ Помощь', async (ctx) => {
  await ctx.replyWithMarkdown(`
❓ *Помощь*

*Mangystau Job Bridge* - платформа для быстрого трудоустройства в Актау.

📱 *Возможности:*
• Опубликовать вакансию за 10 секунд
• Получать отклики от кандидатов
• AI автоматически структурирует данные

💰 *Тарифы:*
• Freemium: 50 откликов бесплатно
• Basic: 2900 ₸/мес - безлимит
• Premium: 5900 ₸/мес - аналитика

🌐 *Сайт:* [mjb.kz](https://mjb.kz)
  `, mainKeyboard);
});

// Handle "Открыть сайт" button
bot.hears('🌐 Открыть сайт', async (ctx) => {
  await ctx.replyWithMarkdown(`
🌐 *Mangystau Job Bridge*

🔗 [Перейти на сайт](https://mjb.kz)

На сайте вы можете:
• Искать вакансии по карте
• Создать резюме голосом
• Пройти AI тест
• Обучиться на курсах
  `);
});

// Error handler
bot.catch((err, ctx) => {
  console.error('❌ Bot error:', err);
  ctx.reply('⚠️ Произошла ошибка. Попробуйте еще раз или напишите /start');
});

// Start the bot
console.log(`
╔══════════════════════════════════════════╗
║     🤖 Mangystau Job Bridge Bot          ║
║     🚀 Запуск...                          ║
╚══════════════════════════════════════════╝
`);

bot.launch()
  .then(() => {
    console.log('✅ Bot successfully started!');
    console.log('📱 Send /start to test the bot');
    console.log('🔗 Bot username: @mjb_job_bot');
  })
  .catch((err) => {
    console.error('❌ Failed to start bot:', err);
    process.exit(1);
  });

// Graceful shutdown
process.once('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGTERM');
});
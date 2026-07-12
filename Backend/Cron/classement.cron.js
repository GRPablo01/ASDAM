const cron = require('node-cron');


// Tous les jours à 3h du matin
cron.schedule('0 3 * * *', async () => {
  console.log('🔄 [CRON] Vérification classements...');
  await classementService.verifierEtGenerer();
  console.log('✅ [CRON] Classements vérifiés');
});

console.log('⏰ Cron job classement activé (3h00 tous les jours)');
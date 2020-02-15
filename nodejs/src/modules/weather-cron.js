import cron from "node-cron";

export default () => {
  // Run Every Hour
  cron.schedule('0 * * * *', () => {
    console.log('Running Cron Task - Weather');
    // scrap.fetchWeatherData();
  });
}
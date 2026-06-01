import https from 'https';

const checkUrl = (url: string) => {
  return new Promise((resolve) => {
    https.get(url, (res) => {
      resolve(res.statusCode === 200 ? 'OK' : 'FAIL ' + res.statusCode);
    }).on('error', () => resolve('ERROR'));
  });
};

const urls = [
  'https://images.unsplash.com/photo-1604581177699-2826dbf737a4',
  'https://images.unsplash.com/photo-1546069901-ba9599a7e63c',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd',
  'https://images.unsplash.com/photo-1627308595229-7830f5c92f8d',
  'https://images.unsplash.com/photo-1626082927389-6cd097cdc6ec',
  'https://images.unsplash.com/photo-1548685913-fe6678babe8d',
  'https://images.unsplash.com/photo-1612929633738-8fe01f7c8ba5',
  'https://images.unsplash.com/photo-1565557613262-ba45318baad2',
  'https://images.unsplash.com/photo-1625944525533-473f1a3d54e7',
  'https://images.unsplash.com/photo-1574484284002-952d92456975',
  'https://images.unsplash.com/photo-1555939594-58d7cb561ad1',
  'https://images.unsplash.com/photo-1556679343-c7306c1976bc',
  'https://images.unsplash.com/photo-1600271886742-f049cd451bba',
  'https://images.unsplash.com/photo-1555507036-ab1f40ce88ca'
];

async function run() {
  for (const url of urls) {
    const status = await checkUrl(url);
    console.log(url, status);
  }
}
run();

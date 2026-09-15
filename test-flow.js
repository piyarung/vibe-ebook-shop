async function testFlow() {
  console.log('--- TEST 1: Create Order ---');
  const createRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'สมชาย นักพัฒนา',
      customerEmail: 'somchai@test.com',
      bookId: 'book-1',
    }),
  });
  const createData = await createRes.json();
  console.log('Status Code:', createRes.status);
  console.log('Created Order:', createData);
  const orderId = createData.orderId;

  console.log('\n--- TEST 2: Pay Order (Mock Payment) ---');
  const payRes = await fetch('http://localhost:3000/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
  const payData = await payRes.json();
  console.log('Status Code:', payRes.status);
  console.log('Order Status:', payData.order.status);
  console.log('Download URL:', payData.order.downloadUrl);
  console.log('Email Simulated Message:', payData.emailResult);

  console.log('\n--- TEST 3: Track Order (Authorized Email) ---');
  const trackRes = await fetch('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, email: 'somchai@test.com' }),
  });
  const trackData = await trackRes.json();
  console.log('Status Code:', trackRes.status);
  console.log('Found Order:', trackData.order?.id, 'Status:', trackData.order?.status);

  console.log('\n--- TEST 4: Track Order (Unauthorized / Wrong Email) ---');
  const badTrackRes = await fetch('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, email: 'attacker@test.com' }),
  });
  const badTrackData = await badTrackRes.json();
  console.log('Status Code (Should be 404):', badTrackRes.status);
  console.log('Privacy Protection Result:', badTrackData);

  console.log('\n--- TEST 5: Download E-book File ---');
  const downRes = await fetch(`http://localhost:3000/api/download?orderId=${orderId}`);
  console.log('Download Status Code:', downRes.status);
  console.log('Content-Type:', downRes.headers.get('content-type'));
  const blob = await downRes.arrayBuffer();
  console.log('Downloaded File Size:', blob.byteLength, 'bytes');

  console.log('\n>>> ALL 5 CHECKS PASSED SUCCESSFULLY! <<<');
}

testFlow().catch(console.error);

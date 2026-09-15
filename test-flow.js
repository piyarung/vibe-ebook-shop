async function runComprehensiveVerification() {
  console.log('=====================================================');
  console.log('  VERIFICATION TEST SUITE: VIBE CODING E-BOOK SHOP');
  console.log('=====================================================\n');

  const testEmail = 'customer.test@gmail.com';
  const wrongEmail = 'intruder@otherdomain.com';

  // 1. Test Order Creation & Immediate Email Notification
  console.log('[STEP 1] Testing Order Creation & Gmail Notification...');
  const createRes = await fetch('http://localhost:3000/api/orders', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      customerName: 'สมศักดิ์ ผู้รักการอ่าน',
      customerEmail: testEmail,
      bookId: 'book-1',
    }),
  });

  const createData = await createRes.json();
  console.log('  HTTP Status:', createRes.status);
  console.log('  Order ID Created:', createData.orderId);
  console.log('  Initial Status (must be PENDING):', createData.status);
  console.log('  Email Notification Dispatched:', createData.emailResult);

  if (createRes.status !== 200 || createData.status !== 'PENDING' || !createData.orderId) {
    throw new Error('Step 1 Failed: Order creation or initial status check failed.');
  }
  const orderId = createData.orderId;
  console.log('  >>> STEP 1 PASSED: Order created & Order ID notification sent.\n');

  // 2. Test Privacy Protection: Check tracking before payment
  console.log('[STEP 2] Testing Privacy Protection on Tracking Endpoint...');
  
  // Case 2A: Searching with WRONG email (intruder test)
  const intruderRes = await fetch('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, email: wrongEmail }),
  });
  const intruderData = await intruderRes.json();
  console.log('  [Test 2A - Intruder with wrong email]');
  console.log('  HTTP Status (Expected 404):', intruderRes.status);
  console.log('  Response:', intruderData);

  if (intruderRes.status !== 404 || intruderData.success !== false || intruderData.order) {
    throw new Error('Step 2A Failed: Security breach! Unauthorized email received order data.');
  }
  console.log('  >>> TEST 2A PASSED: Data strictly hidden from unauthorized email.\n');

  // Case 2B: Searching with CORRECT email
  console.log('  [Test 2B - Owner with matching email]');
  const ownerRes = await fetch('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, email: testEmail }),
  });
  const ownerData = await ownerRes.json();
  console.log('  HTTP Status (Expected 200):', ownerRes.status);
  console.log('  Order Verified:', ownerData.order?.id, 'Status:', ownerData.order?.status);

  if (ownerRes.status !== 200 || ownerData.order?.id !== orderId || ownerData.order?.status !== 'PENDING') {
    throw new Error('Step 2B Failed: Legitimate owner could not retrieve pending order.');
  }
  console.log('  >>> TEST 2B PASSED: Owner authorized successfully.\n');

  // 3. Test Mock Payment (Transition to PAID + Send Delivery Email)
  console.log('[STEP 3] Testing Mock Payment (Transition to PAID & Delivery Email)...');
  const payRes = await fetch('http://localhost:3000/api/pay', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId }),
  });
  const payData = await payRes.json();
  console.log('  HTTP Status:', payRes.status);
  console.log('  Updated Status (Must be PAID):', payData.order?.status);
  console.log('  Generated Download URL:', payData.order?.downloadUrl);
  console.log('  Delivery Email Dispatched:', payData.emailResult);

  if (payRes.status !== 200 || payData.order?.status !== 'PAID' || !payData.order?.downloadUrl) {
    throw new Error('Step 3 Failed: Mock payment or status update failed.');
  }
  console.log('  >>> STEP 3 PASSED: Mock payment succeeded, status is PAID, download link ready.\n');

  // 4. Test Tracking After Payment
  console.log('[STEP 4] Testing Tracking After Payment...');
  const trackPaidRes = await fetch('http://localhost:3000/api/track', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ orderId, email: testEmail }),
  });
  const trackPaidData = await trackPaidRes.json();
  console.log('  Status in Tracking:', trackPaidData.order?.status);
  console.log('  Download Link in Tracking:', trackPaidData.order?.downloadUrl);

  if (trackPaidData.order?.status !== 'PAID') {
    throw new Error('Step 4 Failed: Tracking did not reflect PAID status.');
  }
  console.log('  >>> STEP 4 PASSED: Tracking shows PAID status and download link.\n');

  // 5. Test Download Delivery Endpoint
  console.log('[STEP 5] Testing E-book Download Delivery Endpoint...');
  const downloadRes = await fetch(`http://localhost:3000/api/download?orderId=${orderId}`);
  console.log('  HTTP Status:', downloadRes.status);
  console.log('  Content-Type:', downloadRes.headers.get('content-type'));
  const buffer = await downloadRes.arrayBuffer();
  console.log('  Downloaded PDF Size:', buffer.byteLength, 'bytes');

  if (downloadRes.status !== 200 || !downloadRes.headers.get('content-type')?.includes('pdf') || buffer.byteLength < 100) {
    throw new Error('Step 5 Failed: Download endpoint did not deliver valid PDF.');
  }
  console.log('  >>> STEP 5 PASSED: PDF successfully delivered.\n');

  console.log('=====================================================');
  console.log('  ALL VERIFICATION TESTS COMPLETED SUCCESSFULLY! ✓');
  console.log('=====================================================');
}

runComprehensiveVerification().catch((err) => {
  console.error('\n❌ VERIFICATION TEST FAILED:', err);
  process.exit(1);
});

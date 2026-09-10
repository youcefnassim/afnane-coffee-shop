const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://hcsaffxeufnhfzmostui.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imhjc2FmZnhldWZuaGZ6bW9zdHVpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODI5MzkyNzQsImV4cCI6MjA5ODUxNTI3NH0.HggSXW4G9OJClbmohMWkAFK-l5VbERSTrpxVJ9VeGw4';

const supabase = createClient(supabaseUrl, supabaseKey);

async function test() {
  const { data, error } = await supabase
    .from('categories')
    .insert({ id: 'test_cat', name: { fr: 'Test', en: 'Test', ar: 'Test' }, icon: '🍎', sort_order: 99 })
    .select();

  console.log('Insert result:', data);
  if (error) console.error('Error:', error);
}

test();

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://dzbvlrohtezwcqukeewz.supabase.co';
const supabaseKey = 'sb_publishable_k0DkR1-uCZCNWScKmyzAsw_-NY2I1Ox';
const supabase = createClient(supabaseUrl, supabaseKey);

async function check() {
  console.log('Checking rooms table...');
  const { data, error } = await supabase.from('rooms').select('*').limit(1);
  if (error) {
    console.error('Error fetching rooms:', error);
  } else {
    console.log('Successfully fetched rooms:', data);
  }
}

check();

(function(){'use strict';
const configured=()=>/^https:\/\/[a-z0-9-]+\.supabase\.co\/?$/i.test(window.TWENTYSEED_SUPABASE_URL||'')&&typeof window.TWENTYSEED_SUPABASE_ANON_KEY==='string'&&window.TWENTYSEED_SUPABASE_ANON_KEY.length>20;
let client;
function getClient(){if(!configured()||!window.supabase||typeof window.supabase.createClient!=='function')return null;if(!client)client=window.supabase.createClient(window.TWENTYSEED_SUPABASE_URL,window.TWENTYSEED_SUPABASE_ANON_KEY,{auth:{autoRefreshToken:true,persistSession:true,detectSessionInUrl:true}});return client}
function safeNext(){const p=new URLSearchParams(location.search).get('next');return p==='parent-dashboard.html'?'parent-dashboard.html':'parent-dashboard.html'}
window.TwentySeedAuth={getClient,configured,safeNext};
})();
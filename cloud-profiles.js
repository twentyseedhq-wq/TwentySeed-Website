// Supabase student persistence. Requires public.students RLS migration to be applied.
// No service-role key, silent localStorage migration, or network call on import.
const createCloudProfiles=(client)=>{
 if(!client||!client.auth||!client.from)throw Error('Supabase client required');
 const getUser=async()=>{const {data,error}=await client.auth.getUser();if(error)throw error;if(!data?.user?.id)throw Error('Sign in required');return data.user.id};
 const table=()=>client.from('students');
 const clean=p=>{
  if(!p||typeof p.name!=='string'||!p.name.trim()||p.name.trim().length>80)throw Error('Valid student name required');
  if(typeof p.grade!=='string'&&p.grade!==undefined)throw Error('Invalid grade');
  if((p.grade||'').length>40)throw Error('Invalid grade');
  return {name:p.name.trim(),grade:p.grade||''};
 };
 const check=(r)=>{if(r.error)throw r.error;return r.data};
 return {
  async list(){const id=await getUser();return check(await table().select('id,name,grade,created_at,updated_at').eq('parent_id',id).order('created_at',{ascending:true}))},
  async add(profile){const parent_id=await getUser();return check(await table().insert({...clean(profile),parent_id}).select('id,name,grade,created_at,updated_at').single())},
  async replace(id,profile){const parent_id=await getUser();if(typeof id!=='string'||!id)throw Error('Student ID required');return check(await table().update(clean(profile)).eq('id',id).eq('parent_id',parent_id).select('id,name,grade,created_at,updated_at').single())},
  async remove(id){const parent_id=await getUser();if(typeof id!=='string'||!id)throw Error('Student ID required');return check(await table().delete().eq('id',id).eq('parent_id',parent_id).select('id').single())}
 };
};
if(typeof module!=='undefined')module.exports=createCloudProfiles;

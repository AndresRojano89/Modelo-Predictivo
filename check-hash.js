const { Pool } = require('pg');
const crypto = require('crypto');

const DATABASE_URL = "postgresql://neondb_owner:npg_C8qfBRdyz6VP@ep-proud-butterfly-atquknbf-pooler.c-9.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require";

const pool = new Pool({
  connectionString: DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

async function checkHash() {
  try {
    const result = await pool.query(
      'SELECT email, password_hash FROM usuarios WHERE email = $1',
      ['admin']
    );
    
    if (result.rows.length === 0) {
      console.log('Usuario admin no encontrado');
      return;
    }
    
    const user = result.rows[0];
    console.log('=== VERIFICACIÓN DE HASH ===');
    console.log('Email:', user.email);
    console.log('Stored Hash:', user.password_hash);
    
    // Calcular hash esperado
    const expectedHash = crypto
      .createHash('sha256')
      .update('admin123' + 'salt_health_analytics')
      .digest('hex');
    
    console.log('Expected Hash:', expectedHash);
    console.log('Match:', user.password_hash === expectedHash);
    
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await pool.end();
  }
}

checkHash();
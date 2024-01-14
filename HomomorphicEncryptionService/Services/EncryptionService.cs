using Microsoft.Research.SEAL;
using System.Numerics;
using System.Text;

namespace HomomorphicEncryptionService.Services
{
    public class EncryptionService
    {
        private readonly SEALContext _context;
        private readonly Encryptor _encryptor;
        private readonly Decryptor _decryptor;
        private readonly IntegerEncoder _encoder;

        public EncryptionService()
        {
            // Configuración inicial del contexto SEAL y los parámetros de cifrado
            var parms = new EncryptionParameters(SchemeType.BFV);
            parms.PolyModulusDegree = 4096;
            parms.CoeffModulus = CoeffModulus.BFVDefault(4096);
            parms.PlainModulus = PlainModulus.Batching(4096, 20);

            _context = new SEALContext(parms);
            var keyGenerator = new KeyGenerator(_context);

            var publicKey = keyGenerator.PublicKey;
            var secretKey = keyGenerator.SecretKey;

            _encryptor = new Encryptor(_context, publicKey);
            _decryptor = new Decryptor(_context, secretKey);
            _encoder = new IntegerEncoder(_context);
        }

        public string Encrypt(string plainText)
        {
            byte[] bytes = Encoding.UTF8.GetBytes(plainText);

            if (bytes.Length < 8)
            {
                byte[] padding = new byte[8 - bytes.Length];
                bytes = bytes.Concat(padding).ToArray();
            }

            long valorNumerico = BitConverter.ToInt64(bytes, 0);

            var textoplano = new Plaintext();
            _encoder.Encode(valorNumerico, textoplano);

            var cipherText = new Ciphertext();
            _encryptor.Encrypt(textoplano, cipherText);

            using (MemoryStream stream = new MemoryStream())
            {
                cipherText.Save(stream);
                string valorCipherText = Convert.ToBase64String(stream.ToArray());
                return valorCipherText;
            }
        }

        public string Decrypt(string cipherTextString)
        {
            // Convierte la cadena cifrada de nuevo a Ciphertext
            var cipherBytes = Convert.FromBase64String(cipherTextString);
            using var stream = new MemoryStream(cipherBytes);
            var ciphertext = new Ciphertext();
            ciphertext.Load(_context, stream);

            // Descifra el texto
            var plaintext = new Plaintext();
            _decryptor.Decrypt(ciphertext, plaintext);
            var valorNumerico = _encoder.DecodeInt64(plaintext);

            // Convierte el valor numérico de vuelta a texto
            var bytes = BitConverter.GetBytes(valorNumerico);
            return Encoding.UTF8.GetString(bytes).TrimEnd('\0');
        }
    }
}

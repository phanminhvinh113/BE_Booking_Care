import { generalAccessToken } from '../middlewares/auth';
//

const refreshTokenService = async (req, res) => {
   try {
      const newAccessToken = await generalAccessToken(req.user, '1h');
      res.status(200).json({
         errCode: 0,
         message: 'OK!',
         newAccessToken,
      });
   } catch (error) {
      res.status(400).json({
         errCode: -1,
         message: `Error ${error}`,
      });
   }
};
//

module.exports = {
   refreshTokenService,
};

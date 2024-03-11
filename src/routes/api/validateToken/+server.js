import admin from 'firebase-admin';
import {
	SECRET_FIREBASE_PROJECT_ID,
	SECRET_FIREBASE_CLIENT_EMAIL,
	SECRET_FIREBASE_PRIVATE_KEY,
	SECRET_FIREBASE_DATABASE_URL,
	SECRET_ALLOWED_DOMAIN
} from '$env/static/private';

if (!admin.apps.length) {
	admin.initializeApp({
		credential: admin.credential.cert({
			projectId: SECRET_FIREBASE_PROJECT_ID,
			clientEmail: SECRET_FIREBASE_CLIENT_EMAIL,
			privateKey: SECRET_FIREBASE_PRIVATE_KEY
		}),
		databaseURL: SECRET_FIREBASE_DATABASE_URL
	});
}

export const POST = async ({ request }) => {
	const body = (await request.json()) || {};
	const { idToken } = body;
	try {
		const decodedToken = await admin.auth().verifyIdToken(idToken);
		const email = decodedToken.email;
		const uid = decodedToken.uid;
		const domain = email.split('@')[1];
		if (domain !== SECRET_ALLOWED_DOMAIN) {
			await admin.auth().revokeRefreshTokens(uid);
			await admin.auth().deleteUser(uid);
			return new Response(
				JSON.stringify({
					error: `Invalid domain. Only users from ${SECRET_ALLOWED_DOMAIN} are allowed.`
				}),
				{ status: 403 }
			);
		} else {
			return new Response({}, { status: 200 });
		}
	} catch (error) {
		console.error('Error in /api/validateToken', error);
		return new Response(JSON.stringify({ error: 'Server error' }), { status: 500 });
	}
};

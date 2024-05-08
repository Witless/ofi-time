import moment from 'moment';
import { collection, getDocs, orderBy, query, where } from 'firebase/firestore';
import { firestore } from '$lib/firebaseClient.js';

let timesData = {
	Monday: [],
	Tuesday: [],
	Wednesday: [],
	Thursday: [],
	Friday: [],
	Saturday: [],
	Sunday: []
};
export async function load() {
	const startOfWeek = moment().startOf('isoWeek');
	const endOfWeek = moment().endOf('isoWeek');
	const timesCollection = collection(firestore, 'times');
	const timesQuery = query(timesCollection,  where('visible', '==', true), orderBy('initial'));
	const orderedTimes = await getDocs(timesQuery);
	orderedTimes.docs.map((doc) => {
		const data = doc.data();
		const initial = moment(data.initial.toDate());
		if (initial > startOfWeek && initial < endOfWeek) {
			data.initial = initial;
			data.ending = moment(data.ending.toDate());
			timesData[initial.format('dddd')].push(data);
		}
	});
	return timesData;
}

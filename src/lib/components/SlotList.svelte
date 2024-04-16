<script>
	import { user } from '../../stores/userStore.js';
	import {
		addDoc,
		collection,
		deleteDoc,
		doc,
		getDocs,
		orderBy,
		query,
		Timestamp,
		where
	} from 'firebase/firestore';
	import { firestore } from '$lib/firebaseClient.js';
	import { onMount } from 'svelte';
	import moment from 'moment';
	import toast from 'svelte-french-toast';

	export let timesData = [];
	let startDate = '';
	let endDate = '';

	const getFirestoreData = async () => {
		const timesCollection = collection(firestore, 'times');
		const timesQuery = query(timesCollection, orderBy('initial'));
		const orderedTimes = await getDocs(timesQuery);
		const ticketsCollection = collection(firestore, 'tickets');
		const ticketsSnapshot = await getDocs(ticketsCollection);
		const ticketsData = ticketsSnapshot.docs.map((doc) => doc.data());
		timesData = orderedTimes.docs.map((doc) => {
			const data = doc.data();
			let attendees = [];
			ticketsData.forEach((document) => {
				if (document.time_id === doc.id) {
					attendees.push(document.name);
				}
			});
			data.attendees = attendees;
			data.id = doc.id;
			return data;
		});
	};

	const toggleCurrentUserInSlot = async (index) => {
		let time = timesData[index];
		const userIndex = time.attendees.indexOf($user.displayName);
		const ticketsCollection = collection(firestore, 'tickets');

		if (userIndex === -1) {
			await addDoc(ticketsCollection, {
				name: $user.displayName,
				uuid: $user.uid,
				time_id: time.id
			});

			time.attendees.push($user.displayName);
		} else {
			const ticketsSnapshot = await getDocs(ticketsCollection);

			ticketsSnapshot.forEach((ticket) => {
				if (ticket.data().uuid === $user.uid && ticket.data().time_id === time.id) {
					const docRef = doc(firestore, 'tickets', ticket.id);
					deleteDoc(docRef);
				}
			});

			time.attendees.splice(userIndex, 1);
		}

		timesData = [...timesData];
	};

	const deleteCurrentSlot = (index) => {
		const slotId = timesData[index].id;
		const docRef = doc(firestore, 'times', slotId);
		deleteDoc(docRef);
		const ticketsCollection = collection(firestore, 'tickets');
		const queryTicketsSameTime = query(ticketsCollection, where('time_id', '==', slotId));
		getDocs(queryTicketsSameTime).then((docSnapshot) => {
			docSnapshot.docs.forEach((document) => {
				const docRef = doc(firestore, 'tickets', document.id);
				deleteDoc(docRef);
			});
		});
		timesData.splice(index, 1);
		timesData = [...timesData];
	};

	const addSlot = () => {
		if(moment(startDate).toDate() > moment(endDate).toDate()){
			startDate = null;
			endDate = null;
			toast.error(`Start goes first, then the End 😉`, {
				position: 'bottom-right'
			})
			return -1;
		}else if(moment(startDate).toDate() < Date.now() || moment(endDate).toDate() < Date.now()){
			startDate = null;
			endDate = null;
			toast.error(`Plan your opening times starting from today, not earlier ⏰`, {
				position: 'bottom-right'
			})
			return -2;
		}
		const ticketsCollection = collection(firestore, 'tickets');
		const timesCollection = collection(firestore, 'times');
		addDoc(timesCollection, {
			initial: Timestamp.fromDate(moment(startDate).toDate()),
			ending: Timestamp.fromDate(moment(endDate).toDate()),
			creator_id: $user.uid
		}).then((docReference) => {
			addDoc(ticketsCollection, {
				name: $user.displayName,
				uuid: $user.uid,
				time_id: docReference.id
			});
			timesData.push({
				initial: Timestamp.fromDate(moment(startDate).toDate()),
				ending: Timestamp.fromDate(moment(endDate).toDate()),
				creator_id: $user.uid,
				id: docReference.id,
				attendees: [$user.displayName]
			});
			timesData = [...timesData];
		});
	};

	onMount(() => {
		getFirestoreData();
	});
</script>

<div class="flex justify-center md:items-center mt-2 flex-col">
	<div class="flex md:space-x-4 bg-transparent border border-white rounded-3xl p-4 flex-col md:flex-row space-y-3 md:space-y-0">
		<label class="flex flex-col items-center">
			Start Date
			<input type="datetime-local" bind:value={startDate} required />
		</label>
		<label class="flex flex-col items-center">
			End Date
			<input type="datetime-local" bind:value={endDate} required />
		</label>
		<label class="flex flex-col items-center">
			<button class="btn btn-primary max-[600px]:w-44" on:click={addSlot}>Add slot</button>
		</label>
	</div>
</div>

{#if timesData}
	<div class="flex flex-col items-center p-4">
		<div class="overflow-x-auto">
			<table class="table">
				<thead>
					<tr class="max-[600px]:border-b max-[600px]:border-gray-700">
						<th>From</th>
						<th>To</th>
						<th>Attendees</th>
						<th>Actions</th>
					</tr>
				</thead>
				<tbody>
					{#each timesData as item, index}
						<tr class="max-[600px]:border-b max-[600px]:border-gray-700">
							<td>{new Date(item.initial.seconds * 1000).toLocaleString()}</td>
							<td>{new Date(item.ending.seconds * 1000).toLocaleString()}</td>
							<td>
								{#each item.attendees as item, index}
									{#if index!==0}
										<div class="md:hidden">━━━━━━</div>
									{/if}
									<div class="md:badge md:badge-secondary md:mb-1">{item}</div>
									<br class="max-[600px]:hidden">
								{/each}
							</td>
							<td>
								<button
									on:click={() => toggleCurrentUserInSlot(index)}
									class="px-4 py-2 mt-4 rounded-xl bg-blue-500 text-white hover:bg-blue-400"
								>
									{!item.attendees.includes($user.displayName) ? 'Add to slot' : 'Remove from slot'}
								</button>
								{#if item.creator_id == $user.uid}
									<button
										on:click={() => deleteCurrentSlot(index)}
										class="px-4 py-2 mt-4 rounded-xl bg-red-500 text-white hover:bg-red-400"
									>
										Delete slot
									</button>
								{/if}
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{/if}

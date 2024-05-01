import { api, handleError } from "helpers/api";
import subscribeToGameUpdates from 'components/functions/EventGetter';

export const handleMatch = async (myId, token, setLoading) => {
  try {
    setLoading(true);
    const response = await api.put(`/games/queue/${myId}`, {}, {headers: {Authorization: `Bearer ${token}`}});
    const matchResult = (response.data && response.data.gameId !== null);
    setLoading(false);
    return response.data.gameId;
  } catch (error) {
    alert(`Something went wrong during matching an opponent: \n${error}`);
    setLoading(false);
    doQuitQueueing(myId, token, setLoading); // Ensure doQuitQueueing is also handled appropriately
  }
};

export const doQuitQueueing = async (myId, token, setLoading) => {
  try {
    const response = await api.delete(`/games/dequeue/${myId}`, {headers: {Authorization: `Bearer ${token}`}});
    alert(response.data);
    setLoading(false);
  } catch (error) {
    setLoading(false);
    alert(
      `Something went wrong during quiting the queue: \n${handleError(error)}`
    );
  }
};
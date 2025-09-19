import { Router } from 'express';
import { listPlaylists, createPlaylist, getPlaylist, updatePlaylist, deletePlaylist, addSongToPlaylist, removeSongFromPlaylist } from '../controllers/playlistsController.js';

const router = Router();

router.get('/', listPlaylists);
router.post('/', createPlaylist);
router.get('/:id', getPlaylist);
router.put('/:id', updatePlaylist);
router.delete('/:id', deletePlaylist);

router.post('/:id/songs/:songId', addSongToPlaylist);
router.delete('/:id/songs/:songId', removeSongFromPlaylist);

export default router;

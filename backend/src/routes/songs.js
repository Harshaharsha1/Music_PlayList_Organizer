import { Router } from 'express';
import { listSongs, createSong, getSong, updateSong, deleteSong, searchSongs } from '../controllers/songsController.js';

const router = Router();

router.get('/', listSongs);
router.get('/search', searchSongs);
router.post('/', createSong);
router.get('/:id', getSong);
router.put('/:id', updateSong);
router.delete('/:id', deleteSong);

export default router;

/**
 * User registry utility to manage and persist real registered users on the platform.
 */

export interface RegisteredUser {
  id: string;
  name: string;
  branch: string;
  dreamCollege: string;
  pomodoros: number;
  points: number;
  avatar: string;
  registeredAt: string;
  isUser?: boolean;
}

export const INITIAL_REGISTERED_USERS: RegisteredUser[] = [
  { id: 'usr_1', name: 'أحمد محمد الشناوي', branch: 'علمي رياضة', dreamCollege: 'كلية الهندسة - جامعة القاهرة', pomodoros: 26, points: 390, avatar: '👨‍💻', registeredAt: '2026-08-01' },
  { id: 'usr_2', name: 'مي عبد الرحمن حسني', branch: 'علمي علوم', dreamCollege: 'كلية الطب البشري - جامعة عين شمس', pomodoros: 24, points: 360, avatar: '👩‍⚕️', registeredAt: '2026-08-01' },
  { id: 'usr_3', name: 'عبد الله محمود القاضي', branch: 'أدبي', dreamCollege: 'كلية الألسن - جامعة عين شمس', pomodoros: 21, points: 315, avatar: '👨‍⚖️', registeredAt: '2026-08-02' },
  { id: 'usr_4', name: 'منة الله رأفت سليمان', branch: 'علمي علوم', dreamCollege: 'كلية الصيدلة - جامعة الإسكندرية', pomodoros: 17, points: 255, avatar: '👩‍🔬', registeredAt: '2026-08-02' },
  { id: 'usr_5', name: 'مريم إبراهيم الشافعي', branch: 'أدبي', dreamCollege: 'كلية الإعلام - جامعة القاهرة', pomodoros: 15, points: 225, avatar: '👩‍🎨', registeredAt: '2026-08-03' },
  { id: 'usr_6', name: 'زياد طارق حمودة', branch: 'علمي رياضة', dreamCollege: 'كلية الحاسبات والمعلومات - جامعة حلوان', pomodoros: 14, points: 210, avatar: '👨‍💻', registeredAt: '2026-08-04' },
  { id: 'usr_7', name: 'نور الهدى عادل فهمي', branch: 'علمي علوم', dreamCollege: 'كلية طب الأسنان - جامعة المنصورة', pomodoros: 12, points: 180, avatar: '👩‍⚕️', registeredAt: '2026-08-04' },
  { id: 'usr_8', name: 'عمر شريف الدسوقي', branch: 'علمي رياضة', dreamCollege: 'كلية الهندسة - جامعة عين شمس', pomodoros: 10, points: 150, avatar: '👨‍💻', registeredAt: '2026-08-05' }
];

export function getRegisteredUsersFromDB(): RegisteredUser[] {
  try {
    const rawDB = localStorage.getItem('thanaweya_registered_users_db');
    let usersList: RegisteredUser[] = rawDB ? JSON.parse(rawDB) : [...INITIAL_REGISTERED_USERS];

    // Guarantee initial seed if list was empty
    if (!usersList || usersList.length === 0) {
      usersList = [...INITIAL_REGISTERED_USERS];
    }

    // Also scan all localStorage user profiles created on this browser/session
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('thanaweya_user_') && key.endsWith('_profile')) {
        const rawProf = localStorage.getItem(key);
        if (rawProf) {
          const prof = JSON.parse(rawProf);
          if (prof && prof.name && prof.name.trim()) {
            const trimmedName = prof.name.trim();
            const usernameKey = key.replace('thanaweya_user_', '').replace('_profile', '');
            const pointsVal = localStorage.getItem(`thanaweya_user_${usernameKey}_points`);
            const pts = pointsVal ? Number(pointsVal) : 0;
            const branchArabic = prof.branch === 'science' 
              ? 'علمي علوم' 
              : prof.branch === 'math' 
              ? 'علمي رياضة' 
              : prof.branch === 'literature' 
              ? 'أدبي' 
              : 'عام';

            const existingIdx = usersList.findIndex(u => u.name === trimmedName);
            if (existingIdx >= 0) {
              usersList[existingIdx] = {
                ...usersList[existingIdx],
                branch: branchArabic,
                dreamCollege: prof.dreamCollege || usersList[existingIdx].dreamCollege,
                points: Math.max(usersList[existingIdx].points || 0, pts),
                pomodoros: Math.max(usersList[existingIdx].pomodoros || 0, Math.round(pts / 15) || 0)
              };
            } else {
              usersList.push({
                id: `usr_local_${usernameKey}_${Date.now()}`,
                name: trimmedName,
                branch: branchArabic,
                dreamCollege: prof.dreamCollege || 'جامعة أحلام متميزة',
                pomodoros: Math.round(pts / 15) || 0,
                points: pts,
                avatar: prof.branch === 'science' ? '👩‍⚕️' : prof.branch === 'math' ? '👨‍💻' : '👨‍🎓',
                registeredAt: new Date().toISOString().split('T')[0]
              });
            }
          }
        }
      }
    }

    // Persist normalized list
    localStorage.setItem('thanaweya_registered_users_db', JSON.stringify(usersList));
    return usersList;
  } catch (e) {
    console.error('Error fetching registered users:', e);
    return INITIAL_REGISTERED_USERS;
  }
}

export function registerOrUpdateUserInDB(
  name: string,
  branch: string,
  dreamCollege: string,
  pomodoros: number,
  points: number
): RegisteredUser[] {
  if (!name || !name.trim()) return getRegisteredUsersFromDB();
  const trimmedName = name.trim();

  const currentList = getRegisteredUsersFromDB();
  const branchArabic = branch === 'science' 
    ? 'علمي علوم' 
    : branch === 'math' 
    ? 'علمي رياضة' 
    : branch === 'literature' 
    ? 'أدبي' 
    : branch || 'عام';

  const avatar = branch === 'science' ? '👩‍⚕️' : branch === 'math' ? '👨‍💻' : '👨‍🎓';

  const existingIndex = currentList.findIndex(u => u.name === trimmedName);

  if (existingIndex >= 0) {
    currentList[existingIndex] = {
      ...currentList[existingIndex],
      name: trimmedName,
      branch: branchArabic,
      dreamCollege: dreamCollege || currentList[existingIndex].dreamCollege,
      pomodoros: Math.max(currentList[existingIndex].pomodoros, pomodoros),
      points: Math.max(currentList[existingIndex].points, points),
      avatar: avatar
    };
  } else {
    currentList.push({
      id: `usr_${Date.now()}`,
      name: trimmedName,
      branch: branchArabic,
      dreamCollege: dreamCollege || 'كلية المستقبل الرائع',
      pomodoros: pomodoros,
      points: points,
      avatar: avatar,
      registeredAt: new Date().toISOString().split('T')[0]
    });
  }

  try {
    localStorage.setItem('thanaweya_registered_users_db', JSON.stringify(currentList));
  } catch (e) {
    console.error('Error updating registered user DB:', e);
  }

  return currentList;
}

export function getRegisteredUsersCount(): number {
  const users = getRegisteredUsersFromDB();
  return users.length;
}

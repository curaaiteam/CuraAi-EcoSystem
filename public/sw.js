self.addEventListener('push', function(event) {
    if (!event.data) return;
    let data = {};
    try { data = event.data.json(); } catch { data = { title: 'CuraAi', body: event.data.text() }; }
    const options = {
      body: data.body || 'How are you feeling today?',
      icon: '/logo-icon.png',
      badge: '/logo-icon.png',
      tag: 'curaai-reminder',
      renotify: true,
      data: { url: '/chat' },
    };
    event.waitUntil(self.registration.showNotification(data.title || 'CuraAi misses you 💙', options));
  });

  self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    const url = event.notification.data?.url || '/';
    event.waitUntil(
      clients.matchAll({ type: 'window', includeUncontrolled: true }).then(list => {
        for (const c of list) {
          if ('focus' in c) return c.focus();
        }
        if (clients.openWindow) return clients.openWindow(url);
      })
    );
  });
  
async function getAllRooms() {
  try {
    return [
      {
        id: 1,
        name: 'First Room'
      },
      {
        id: 2,
        name: 'Second Room'
      },
      {
        id: 3,
        name: 'Third Room'
      }
    ];
  } catch (e) {
    throw new Error(e);
  }
}

export default { getAllRooms };

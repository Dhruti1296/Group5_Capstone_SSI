using EventService.Data;
using EventService.Models;
using MongoDB.Driver;

namespace EventService.Services
{
    public class EventServices
    {
        private readonly IMongoCollection<Event> _eventCollection;
        public EventServices(MongoDbContext context)
        {
            _eventCollection = context.EventsCollection;
        }

        //Get all the events
        public async Task<List<Event>> GetAllAsync()=>
            await _eventCollection.Find(_=>true).SortBy(e=>e.EventDate).ToListAsync();

       //Get event by Id
        public async Task<Event> GetByIdAsync(string id)=>
            await _eventCollection.Find(e=> e.Id == id).FirstOrDefaultAsync();

        //Get events by types (CSI, sports, volunteer)
        public async Task<List<Event>> GetByTypeAsync(string type) =>
            await _eventCollection.Find(e => e.Type.ToLower() == type.ToLower()).SortBy(e => e.EventDate).ToListAsync();
       
        //To add new event
        public async Task AddSync(Event evnt)
        {
            await _eventCollection.InsertOneAsync(evnt);
        }
        
        //update an event
        public async Task UpdateAsync(string id, Event evnt)
        {
            evnt.Id = id;
            await _eventCollection.ReplaceOneAsync(e => e.Id == id, evnt);
        }

        //Delete an event
        public async Task DeleteAsync(string id)
        {
            await _eventCollection.DeleteOneAsync(e => e.Id == id);
        }            
    }
}

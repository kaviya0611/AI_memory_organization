try:
    from neo4j import GraphDatabase
    from neo4j.exceptions import DriverError
    HAS_NEO4J = True
except ImportError:
    HAS_NEO4J = False
    GraphDatabase = None
    DriverError = Exception

from settings import settings
import logging

logger = logging.getLogger(__name__)

class Neo4jConnection:
    """Neo4j database connection manager for the knowledge graph."""
    
    def __init__(self):
        self.driver = None
        if HAS_NEO4J:
            self.connect()
        else:
            logger.info("Neo4j driver package not installed; using graph memory fallback")
    
    def connect(self):
        """Establish connection to Neo4j."""
        if not HAS_NEO4J:
            return
        try:
            self.driver = GraphDatabase.driver(
                settings.neo4j_uri,
                auth=(settings.neo4j_user, settings.neo4j_password),
                max_connection_pool_size=50,
                connection_timeout=2.0
            )
            # Verify connection
            with self.driver.session() as session:
                session.run("RETURN 1")
            logger.info("✅ Connected to Neo4j")
        except DriverError as e:
            logger.warning(f"⚠️ Failed to connect to Neo4j ({str(e)}) - continuing with local graph engine")
            self.driver = None
        except Exception as e:
            logger.warning(f"⚠️ Neo4j connection skipped ({str(e)})")
            self.driver = None
    
    def close(self):
        """Close the driver connection."""
        if self.driver:
            self.driver.close()
            logger.info("Closed Neo4j connection")
    
    def get_session(self):
        """Get a Neo4j session."""
        if self.driver:
            return self.driver.session()
        return None
    
    def is_connected(self):
        """Check if Neo4j is connected."""
        return self.driver is not None

# Global Neo4j connection
neo4j_conn = Neo4jConnection()

def get_neo4j():
    """Dependency for getting Neo4j connection."""
    if neo4j_conn.is_connected():
        return neo4j_conn.driver
    return None

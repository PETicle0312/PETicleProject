@Repository
public interface SchoolRepository extends JpaRepository<SchoolEntity, Long> {
    List<SchoolEntity> findBySchoolNameContaining(String keyword);
}

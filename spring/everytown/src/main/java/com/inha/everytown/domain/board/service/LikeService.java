package com.inha.everytown.domain.board.service;

import com.inha.everytown.domain.board.entity.relation.Board;
import com.inha.everytown.domain.board.entity.relation.Like;
import com.inha.everytown.domain.board.repository.relation.BoardRepository;
import com.inha.everytown.domain.board.repository.relation.LikeRepository;
import com.inha.everytown.domain.member.entity.Member;
import com.inha.everytown.domain.member.repository.MemberRepository;
import com.inha.everytown.global.exception.CustomException;
import com.inha.everytown.global.exception.ErrorCode;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class LikeService {

    private final LikeRepository likeRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    public Boolean didMemberLike(Long memberId, Long boardId) {
        List<Like> like = likeRepository.findByMember_IdAndBoard_Id(memberId, boardId);
        return !like.isEmpty();
    }

    public Long doLike(Long memberId, Long boardId) {
        Member member = memberRepository.findById(memberId).orElseThrow(
                () -> new CustomException(ErrorCode.UNAUTHORIZED_MEMBER)
        );
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD)
        );
        if (!didMemberLike(memberId,boardId)) {
            likeRepository.save(
                    Like.builder()
                            .board(board)
                            .member(member)
                            .build()
            );
            board.increaseLikeCnt();
        }
        return board.getLikeCnt();
    }

    public Long cancelLike(Long memberId, Long boardId) {
        Board board = boardRepository.findById(boardId).orElseThrow(
                () -> new CustomException(ErrorCode.BOARD_NO_SUCH_BOARD)
        );
        List<Like> like = likeRepository.findByMember_IdAndBoard_Id(memberId, boardId);
        if(like.isEmpty()) throw new CustomException(ErrorCode.UNAUTHORIZED_MEMBER);
        likeRepository.deleteAll(like);
        board.decreaseLikeCnt();
        return board.getLikeCnt();
    }

    public void deleteLikeRelatedBoard(Long boardId) {
        likeRepository.deleteByBoard_Id(boardId);
    }
}
